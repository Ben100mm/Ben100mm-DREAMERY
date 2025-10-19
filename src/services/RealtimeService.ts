import { io, Socket } from 'socket.io-client';

type ChatMessage = { room: string; user: string; text: string; ts: number };

type MessageListener = (msg: ChatMessage) => void;
type JoinedListener = (room: string) => void;
type PresenceListener = (room: string, peerIds: string[]) => void;
type TypingListener = (payload: { room: string; user: string }) => void;
type TaskListener = (payload: { type: 'created' | 'updated' | 'deleted'; task: any }) => void;
type DocListener = (payload: { type: 'shared' | 'unshared' | 'created' | 'updated' | 'deleted'; documentId: string }) => void;
type ComplianceListener = (payload: { type: 'updated'; recordId: string }) => void;

export class RealtimeService {
  private socket: Socket | null = null;
  private messageListeners: Set<MessageListener> = new Set();
  private joinedListeners: Set<JoinedListener> = new Set();
  private presenceListeners: Set<PresenceListener> = new Set();
  private typingListeners: Set<TypingListener> = new Set();
  private taskListeners: Set<TaskListener> = new Set();
  private docListeners: Set<DocListener> = new Set();
  private complianceListeners: Set<ComplianceListener> = new Set();

  connect(url: string) {
    if (this.socket) return;
    this.socket = io(url, { transports: ['websocket', 'polling'], withCredentials: false });
    this.socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('[chat] connected', this.socket?.id);
    });
    this.socket.on('connect_error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[chat] connect_error', err);
    });
    this.socket.on('message', (msg: ChatMessage) => {
      this.messageListeners.forEach((l) => l(msg));
    });
    this.socket.on('joined', (room: string) => {
      this.joinedListeners.forEach((l) => l(room));
    });
    this.socket.on('presence', (ids: string[]) => {
      // We don't receive room in this event; clients track current room
      // For simplicity, notify with last joined room stored locally
      const room = (this.socket as any)._lastRoom as string | undefined;
      if (room) this.presenceListeners.forEach((l) => l(room, ids));
    });
    this.socket.on('typing', (payload: { room: string; user: string }) => {
      this.typingListeners.forEach((l) => l(payload));
    });
    this.socket.on('task_event', (payload: { type: 'created' | 'updated' | 'deleted'; task: any }) => {
      this.taskListeners.forEach((l) => l(payload));
    });
    this.socket.on('doc_event', (payload: { type: 'shared' | 'unshared' | 'created' | 'updated' | 'deleted'; documentId: string }) => {
      this.docListeners.forEach((l) => l(payload));
    });
    this.socket.on('compliance_event', (payload: { type: 'updated'; recordId: string }) => {
      this.complianceListeners.forEach((l) => l(payload));
    });
  }

  onMessage(listener: MessageListener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onJoined(listener: JoinedListener) {
    this.joinedListeners.add(listener);
    return () => this.joinedListeners.delete(listener);
  }

  onPresence(listener: PresenceListener) {
    this.presenceListeners.add(listener);
    return () => this.presenceListeners.delete(listener);
  }

  onTyping(listener: TypingListener) {
    this.typingListeners.add(listener);
    return () => this.typingListeners.delete(listener);
  }

  onTask(listener: TaskListener) {
    this.taskListeners.add(listener);
    return () => this.taskListeners.delete(listener);
  }

  onDoc(listener: DocListener) {
    this.docListeners.add(listener);
    return () => this.docListeners.delete(listener);
  }

  onCompliance(listener: ComplianceListener) {
    this.complianceListeners.add(listener);
    return () => this.complianceListeners.delete(listener);
  }

  join(room: string) {
    this.socket?.emit('join', room);
    if (this.socket) (this.socket as any)._lastRoom = room;
  }

  send(room: string, user: string, text: string) {
    this.socket?.emit('message', { room, user, text, ts: Date.now() });
  }

  typing(room: string, user: string) {
    this.socket?.emit('typing', room, user);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.messageListeners.clear();
    this.joinedListeners.clear();
    this.presenceListeners.clear();
    this.typingListeners.clear();
    this.taskListeners.clear();
    this.docListeners.clear();
    this.complianceListeners.clear();
  }
}

export const realtimeService = new RealtimeService();
