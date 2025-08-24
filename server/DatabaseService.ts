import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { schemas } from '../src/schemas/validation';
import type {
  User,
  UserRole,
  Workflow,
  DocumentTemplate,
  Task,
  AnalyticsMetric,
  ApiResponse,
  PaginatedResponse,
  DeepPartial,
  ComplianceRecord,
} from '../src/types/database';

const prisma = new PrismaClient();

export class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = prisma;
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async create<T>(model: any, data: any, schema: z.ZodSchema<T>): Promise<ApiResponse<T>> {
    try {
      const validatedData = schema.parse(data);
      const result = await model.create({ data: validatedData, include: this.getIncludeOptions(model) });
      return { success: true, data: result, timestamp: new Date() } as ApiResponse<T>;
    } catch (error) {
      return { success: false, error: (error as Error).message, timestamp: new Date() };
    }
  }

  private async findMany<T>(model: any, where: any = {}, pagination: { page: number; limit: number } = { page: 1, limit: 20 }, orderBy: any = { createdAt: 'desc' }): Promise<PaginatedResponse<T>> {
    const skip = (pagination.page - 1) * pagination.limit;
    const [data, total] = await Promise.all([
      model.findMany({ where, skip, take: pagination.limit, orderBy, include: this.getIncludeOptions(model) }),
      model.count({ where }),
    ]);
    return { data, pagination: { page: pagination.page, limit: pagination.limit, total, totalPages: Math.ceil(total / pagination.limit) } };
  }

  private async findUnique<T>(model: any, where: any): Promise<T | null> {
    return model.findUnique({ where, include: this.getIncludeOptions(model) });
  }

  private async update<T>(model: any, where: any, data: DeepPartial<T>, schema: z.ZodSchema<T>): Promise<ApiResponse<T>> {
    try {
      const validatedData = schema.parse(data);
      const result = await model.update({ where, data: validatedData, include: this.getIncludeOptions(model) });
      return { success: true, data: result, timestamp: new Date() } as ApiResponse<T>;
    } catch (error) {
      return { success: false, error: (error as Error).message, timestamp: new Date() };
    }
  }

  private async delete(model: any, where: any): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      await model.delete({ where });
      return { success: true, data: { deleted: true }, timestamp: new Date() };
    } catch (error) {
      return { success: false, error: (error as Error).message, timestamp: new Date() };
    }
  }

  private getIncludeOptions(model: any) {
    const modelName = model.name || model.constructor.name;
    switch (modelName) {
      case 'User':
        return { role: true, profile: true };
      case 'UserRole':
        return { category: true, permissions: { include: { permission: true } } };
      case 'Workflow':
        return { role: true, steps: { orderBy: { order: 'asc' } } };
      case 'DocumentTemplate':
        return { role: true };
      case 'Task':
        return { role: true, user: true, reminders: true };
      default:
        return {};
    }
  }

  // Users
  async createUser(data: z.infer<typeof schemas.createUser>): Promise<ApiResponse<User>> { return this.create(this.prisma.user, data, schemas.createUser); }
  async findUsers(where: any = {}, pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<User>> { return this.findMany(this.prisma.user, where, pagination); }
  async findUserById(id: string): Promise<User | null> { return this.findUnique(this.prisma.user, { id }); }
  async updateUser(id: string, data: z.infer<typeof schemas.updateUser>): Promise<ApiResponse<User>> { return this.update(this.prisma.user, { id }, data, schemas.updateUser); }
  async deleteUser(id: string) { return this.delete(this.prisma.user, { id }); }

  // Roles
  async createRole(data: z.infer<typeof schemas.createUserRole>): Promise<ApiResponse<UserRole>> { return this.create(this.prisma.userRole, data, schemas.createUserRole); }
  async findRoles(where: any = {}, pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<UserRole>> { return this.findMany(this.prisma.userRole, where, pagination); }

  // Workflows
  async createWorkflow(data: z.infer<typeof schemas.createWorkflow>): Promise<ApiResponse<Workflow>> { return this.create(this.prisma.workflow, data, schemas.createWorkflow); }

  // Documents
  async createDocumentTemplate(data: z.infer<typeof schemas.createDocumentTemplate>): Promise<ApiResponse<DocumentTemplate>> { return this.create(this.prisma.documentTemplate, data, schemas.createDocumentTemplate); }

  // Tasks
  async createTask(data: z.infer<typeof schemas.createTask>): Promise<ApiResponse<Task>> { return this.create(this.prisma.task, data, schemas.createTask); }
  async findTasks(where: any = {}, pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<Task>> { return this.findMany(this.prisma.task, where, pagination); }
  async findTasksByRole(roleId: string): Promise<Task[]> {
    return this.prisma.task.findMany({ where: { roleId }, include: this.getIncludeOptions(this.prisma.task), orderBy: { dueDate: 'asc' } });
  }
  async updateTaskStatus(id: string, status: string): Promise<ApiResponse<Task>> {
    const data = { status, ...(status === 'completed' ? { completedAt: new Date() } : {}) };
    return this.update(this.prisma.task, { id }, data, schemas.updateTask);
  }

  // Analytics
  async createAnalyticsMetric(data: Omit<AnalyticsMetric, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AnalyticsMetric>> {
    return this.create(this.prisma.analyticsMetric, data, schemas.analyticsMetric.omit({ id: true, createdAt: true, updatedAt: true }));
  }
  async findAnalyticsMetrics(where: any = {}, pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<AnalyticsMetric>> {
    return this.findMany(this.prisma.analyticsMetric, where, pagination);
  }

  // Compliance
  async createComplianceRecord(data: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ComplianceRecord>> {
    return this.create(this.prisma.complianceRecord, data, schemas.complianceRecord.omit({ id: true, createdAt: true, updatedAt: true }));
  }
  async findComplianceRecords(where: any = {}, pagination = { page: 1, limit: 20 }): Promise<PaginatedResponse<ComplianceRecord>> {
    return this.findMany(this.prisma.complianceRecord, where, pagination);
  }

  async healthCheck(): Promise<boolean> {
    try { await this.prisma.$queryRaw`SELECT 1`; return true; } catch { return false; }
  }
  async disconnect(): Promise<void> { await this.prisma.$disconnect(); }
}

export const databaseService = DatabaseService.getInstance();
export { prisma };

