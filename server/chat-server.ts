import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
app.use(cors());
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const prisma = new PrismaClient();

type Presence = { [room: string]: Set<string> };
const presence: Presence = {};

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('client connected', socket.id);
  // join room by role or custom room id
  socket.on('join', (room: string) => {
    socket.join(room);
    // eslint-disable-next-line no-console
    console.log(`joined room: ${room} by ${socket.id}`);
    socket.emit('joined', room);
    if (!presence[room]) presence[room] = new Set();
    presence[room].add(socket.id);
    io.to(room).emit('presence', Array.from(presence[room]));
  });

  socket.on('message', (data: { room: string; user: string; text: string; ts?: number }) => {
    const payload = { ...data, ts: data.ts ?? Date.now() };
    // eslint-disable-next-line no-console
    console.log(`message to ${data.room} from ${data.user}: ${data.text}`);
    io.to(data.room).emit('message', payload);
    // persist
    prisma.chatMessage.create({ data: { room: data.room, userName: data.user || 'anonymous', text: data.text, ts: new Date(payload.ts) } }).catch(() => {});
  });

  socket.on('typing', (room: string, user: string) => {
    socket.to(room).emit('typing', { room, user });
  });

  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('client disconnected', socket.id);
    // remove from presence
    Object.keys(presence).forEach((room) => {
      if (presence[room].delete(socket.id)) io.to(room).emit('presence', Array.from(presence[room]));
    });
  });
});

const PORT = process.env.CHAT_PORT ? Number(process.env.CHAT_PORT) : 5055;
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Chat server listening on :${PORT}`);
});

// --- Task Queue APIs ---
// List tasks for a role
app.get('/api/tasks', async (req, res) => {
  try {
    const roleId = String(req.query.roleId || '');
    if (!roleId) return res.status(400).json({ error: 'roleId required' });
    const tasks = await prisma.task.findMany({ where: { roleId }, orderBy: { createdAt: 'desc' } });
    res.json({ data: tasks });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// --- Shared Documents APIs ---
// List shared documents for a role (filter on data.sharedWith)
app.get('/api/docs/shared', async (req, res) => {
  try {
    const roleId = String(req.query.roleId || '');
    if (!roleId) return res.status(400).json({ error: 'roleId required' });
    const docs = await prisma.documentInstance.findMany({
      include: { template: true as any },
      orderBy: { createdAt: 'desc' },
      take: 200,
    } as any);
    const filtered = (docs as any[]).filter((d) => Array.isArray(d.data?.sharedWith) && d.data.sharedWith.includes(roleId));
    res.json({ data: filtered });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch shared documents' });
  }
});

// Update shared roles for a document
app.patch('/api/docs/:id/share', async (req, res) => {
  try {
    const id = String(req.params.id);
    const { addRoles = [], removeRoles = [] } = req.body || {};
    const doc = await prisma.documentInstance.findUnique({ where: { id } });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    const current = Array.isArray((doc as any).data?.sharedWith) ? (doc as any).data.sharedWith as string[] : [];
    const next = Array.from(new Set([...current.filter((r) => !removeRoles.includes(r)), ...addRoles]));
    const updated = await prisma.documentInstance.update({ where: { id }, data: { data: { ...(doc as any).data, sharedWith: next } as any } });
    res.json({ data: updated });
    // notify all roles affected
    next.forEach((rid) => io.to(rid).emit('doc_event', { type: 'shared', documentId: id }));
    removeRoles.forEach((rid: string) => io.to(rid).emit('doc_event', { type: 'unshared', documentId: id }));
  } catch (e) {
    res.status(500).json({ error: 'Failed to update sharing' });
  }
});

// Download a document instance (simple text rendering for prototype)
app.get('/api/docs/:id/download', async (req, res) => {
  try {
    const id = String(req.params.id);
    const doc = await prisma.documentInstance.findUnique({ where: { id }, include: { template: true as any } } as any);
    if (!doc) return res.status(404).send('Not found');
    const content = `Document: ${(doc as any).template?.name || doc.templateId}\nStatus: ${doc.status}\nData: ${JSON.stringify(doc.data, null, 2)}`;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="document-${id}.txt"`);
    res.send(content);
  } catch (e) {
    res.status(500).send('Failed to download');
  }
});

// --- Compliance APIs ---
// List compliance records for a role or user
app.get('/api/compliance/records', async (req, res) => {
  try {
    const roleId = req.query.roleId ? String(req.query.roleId) : undefined;
    const userId = req.query.userId ? String(req.query.userId) : undefined;
    const where: any = {};
    if (userId) where.userId = userId;
    if (roleId) {
      // Join through requirement to filter by role
      const records = await prisma.complianceRecord.findMany({
        where,
        include: { requirement: true, user: true },
        orderBy: { createdAt: 'desc' },
      });
      const filtered = records.filter((r: any) => r.requirement?.roleId === roleId);
      return res.json({ data: filtered });
    }
    const records = await prisma.complianceRecord.findMany({
      where,
      include: { requirement: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ data: records });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch compliance records' });
  }
});

// Update a compliance record (status, notes, evidence)
app.patch('/api/compliance/records/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    const { status, notes, evidence, userId, roleId } = req.body || {};
    const data: any = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (evidence !== undefined) data.evidence = evidence;
    const before = await prisma.complianceRecord.findUnique({ where: { id } });
    const record = await prisma.complianceRecord.update({ where: { id }, data, include: { requirement: true, user: true } });
    res.json({ data: record });
    // emit realtime to role room
    const emitRole = roleId || (record as any).requirement?.roleId;
    if (emitRole) io.to(emitRole).emit('compliance_event', { type: 'updated', recordId: id });
    // write audit log
    const changes = { before, after: record } as any;
    if (userId) {
      prisma.auditLog.create({
        data: {
          userId,
          action: 'update',
          resource: 'compliance_record',
          resourceId: id,
          changes,
        },
      }).catch(() => {});
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to update compliance record' });
  }
});

// Compliance summary for a role
app.get('/api/compliance/summary', async (req, res) => {
  try {
    const roleId = String(req.query.roleId || '');
    if (!roleId) return res.status(400).json({ error: 'roleId required' });
    const records = await prisma.complianceRecord.findMany({
      include: { requirement: true },
    });
    const filtered = records.filter((r: any) => r.requirement?.roleId === roleId);
    const open = filtered.filter((r) => r.status !== 'verified').length;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const verifiedThisMonth = filtered.filter((r) => r.status === 'verified' && r.verifiedAt && r.verifiedAt >= startOfMonth).length;
    res.json({ data: { open, verifiedThisMonth, total: filtered.length } });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch compliance summary' });
  }
});

// Audit logs (optionally filter by resource)
app.get('/api/audit/logs', async (req, res) => {
  try {
    const resource = req.query.resource ? String(req.query.resource) : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const logs = await prisma.auditLog.findMany({
      where: resource ? { resource } : undefined,
      orderBy: { timestamp: 'desc' },
      take: Math.min(limit, 500),
    });
    res.json({ data: logs });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// --- Partner Profiles APIs ---
// List partners with simple filters
app.get('/api/partners', async (req, res) => {
  try {
    const q = req.query.q ? String(req.query.q) : undefined;
    const partners = await prisma.partnerProfile.findMany({
      include: { user: true },
      orderBy: { rating: 'desc' }
    } as any);
    const filtered = q
      ? (partners as any[]).filter((p) =>
          [p.company, p.user?.firstName, p.user?.lastName]
            .join(' ')
            .toLowerCase()
            .includes(q.toLowerCase())
        )
      : partners;
    res.json({ data: filtered });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Create/update a partner profile (minimal)
app.post('/api/partners', async (req, res) => {
  try {
    const { userId, company, bio, services = [], languages = [] } = req.body || {};
    if (!userId || !company) return res.status(400).json({ error: 'userId and company required' });
    const upserted = await prisma.partnerProfile.upsert({
      where: { userId },
      update: { company, bio, services, languages },
      create: {
        userId,
        company,
        bio: bio || '',
        services,
        coverageArea: { type: 'FeatureCollection', features: [] } as any,
        languages,
        availability: {},
        licenses: [],
      },
    } as any);
    res.json({ data: upserted });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save partner' });
  }
});
// Create a task in a role's queue
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, roleId, userId, priority } = req.body || {};
    if (!title || !roleId || !userId) return res.status(400).json({ error: 'title, roleId, userId required' });
    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        roleId,
        userId,
        status: 'pending',
        priority: (priority || 'medium') as any,
        tags: [],
      },
    });
    res.json({ data: task });
    // broadcast to role room
    io.to(roleId).emit('task_event', { type: 'created', task });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Handoff task to another role or update status
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    const { roleId, status } = req.body || {};
    const data: any = {};
    if (roleId) data.roleId = roleId;
    if (status) data.status = status;
    const task = await prisma.task.update({ where: { id }, data });
    res.json({ data: task });
    // broadcast to both old and new roles if role changed
    if (roleId) {
      io.to(roleId).emit('task_event', { type: 'created', task });
    }
    io.to(task.roleId).emit('task_event', { type: 'updated', task });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Property search endpoint
app.post('/api/properties/search', async (req, res) => {
  try {
    const searchParams = req.body;
    
    // Call Python service
    const pythonProcess = spawn('python3', [
      path.join(__dirname, 'dreamery_property_api.py'),
      JSON.stringify(searchParams)
    ]);
    
    let data = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });
    
    pythonProcess.stderr.on('data', (chunk) => {
      error += chunk.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(data);
          res.json(result);
        } catch (parseError) {
          res.status(500).json({ 
            success: false, 
            error: 'Failed to parse property data' 
          });
        }
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Property search failed' 
        });
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
