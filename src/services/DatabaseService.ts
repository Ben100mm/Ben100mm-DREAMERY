import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { schemas } from '../schemas/validation';
import type {
  User,
  UserRole,
  Workflow,
  DocumentTemplate,
  ComplianceRequirement,
  Task,
  AnalyticsMetric,
  ApiResponse,
  PaginatedResponse,
  DeepPartial,
} from '../types/database';

// Initialize Prisma client
const prisma = new PrismaClient();

// Database service class
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

  // Generic CRUD operations
  private async create<T>(
    model: any,
    data: any,
    schema: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    try {
      // Validate input data
      const validatedData = schema.parse(data);
      
      // Create record
      const result = await model.create({
        data: validatedData,
        include: this.getIncludeOptions(model),
      });

      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  private async findMany<T>(
    model: any,
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 },
    orderBy: any = { createdAt: 'desc' }
  ): Promise<PaginatedResponse<T>> {
    try {
      const skip = (pagination.page - 1) * pagination.limit;
      
      const [data, total] = await Promise.all([
        model.findMany({
          where,
          skip,
          take: pagination.limit,
          orderBy,
          include: this.getIncludeOptions(model),
        }),
        model.count({ where }),
      ]);

      return {
        data,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages: Math.ceil(total / pagination.limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async findUnique<T>(
    model: any,
    where: any
  ): Promise<T | null> {
    try {
      return await model.findUnique({
        where,
        include: this.getIncludeOptions(model),
      });
    } catch (error) {
      throw new Error(`Failed to fetch record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async update<T>(
    model: any,
    where: any,
    data: DeepPartial<T>,
    schema: z.ZodSchema<T>
  ): Promise<ApiResponse<T>> {
    try {
      // Validate input data
      const validatedData = schema.parse(data);
      
      // Update record
      const result = await model.update({
        where,
        data: validatedData,
        include: this.getIncludeOptions(model),
      });

      return {
        success: true,
        data: result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  private async delete(
    model: any,
    where: any
  ): Promise<ApiResponse<{ deleted: boolean }>> {
    try {
      await model.delete({ where });
      
      return {
        success: true,
        data: { deleted: true },
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  // Get include options for each model
  private getIncludeOptions(model: any) {
    const modelName = model.name || model.constructor.name;
    
    switch (modelName) {
      case 'User':
        return {
          role: true,
          profile: true,
        };
      case 'UserRole':
        return {
          category: true,
          permissions: {
            include: {
              permission: true,
            },
          },
        };
      case 'Workflow':
        return {
          role: true,
          steps: {
            orderBy: { order: 'asc' },
          },
        };
      case 'DocumentTemplate':
        return {
          role: true,
        };
      case 'Task':
        return {
          role: true,
          user: true,
          reminders: true,
        };
      default:
        return {};
    }
  }

  // User operations
  async createUser(data: z.infer<typeof schemas.createUser>): Promise<ApiResponse<User>> {
    return this.create(this.prisma.user, data, schemas.createUser);
  }

  async findUsers(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<User>> {
    return this.findMany(this.prisma.user, where, pagination);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.findUnique(this.prisma.user, { id });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.findUnique(this.prisma.user, { email });
  }

  async updateUser(id: string, data: z.infer<typeof schemas.updateUser>): Promise<ApiResponse<User>> {
    return this.update(this.prisma.user, { id }, data, schemas.updateUser);
  }

  async deleteUser(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.delete(this.prisma.user, { id });
  }

  // Role operations
  async createRole(data: z.infer<typeof schemas.createUserRole>): Promise<ApiResponse<UserRole>> {
    return this.create(this.prisma.userRole, data, schemas.createUserRole);
  }

  async findRoles(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<UserRole>> {
    return this.findMany(this.prisma.userRole, where, pagination);
  }

  async findRoleById(id: string): Promise<UserRole | null> {
    return this.findUnique(this.prisma.userRole, { id });
  }

  async findRolesByCategory(categoryId: string): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({
      where: { categoryId },
      include: this.getIncludeOptions(this.prisma.userRole),
    });
  }

  // Workflow operations
  async createWorkflow(data: z.infer<typeof schemas.createWorkflow>): Promise<ApiResponse<Workflow>> {
    return this.create(this.prisma.workflow, data, schemas.createWorkflow);
  }

  async findWorkflows(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<Workflow>> {
    return this.findMany(this.prisma.workflow, where, pagination);
  }

  async findWorkflowsByRole(roleId: string): Promise<Workflow[]> {
    return this.prisma.workflow.findMany({
      where: { roleId },
      include: this.getIncludeOptions(this.prisma.workflow),
    });
  }

  async findWorkflowById(id: string): Promise<Workflow | null> {
    return this.findUnique(this.prisma.workflow, { id });
  }

  // Document operations
  async createDocumentTemplate(data: z.infer<typeof schemas.createDocumentTemplate>): Promise<ApiResponse<DocumentTemplate>> {
    return this.create(this.prisma.documentTemplate, data, schemas.createDocumentTemplate);
  }

  async findDocumentTemplates(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<DocumentTemplate>> {
    return this.findMany(this.prisma.documentTemplate, where, pagination);
  }

  async findDocumentTemplatesByRole(roleId: string): Promise<DocumentTemplate[]> {
    return this.prisma.documentTemplate.findMany({
      where: { roleId },
      include: this.getIncludeOptions(this.prisma.documentTemplate),
    });
  }

  // Task operations
  async createTask(data: z.infer<typeof schemas.createTask>): Promise<ApiResponse<Task>> {
    return this.create(this.prisma.task, data, schemas.createTask);
  }

  async findTasks(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<Task>> {
    return this.findMany(this.prisma.task, where, pagination);
  }

  async findTasksByUser(userId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      include: this.getIncludeOptions(this.prisma.task),
      orderBy: { dueDate: 'asc' },
    });
  }

  async findTasksByRole(roleId: string): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { roleId },
      include: this.getIncludeOptions(this.prisma.task),
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateTaskStatus(id: string, status: string): Promise<ApiResponse<Task>> {
    const data = { status, ...(status === 'completed' ? { completedAt: new Date() } : {}) };
    return this.update(this.prisma.task, { id }, data, schemas.updateTask);
  }

  // Analytics operations
  async createAnalyticsMetric(data: Omit<AnalyticsMetric, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<AnalyticsMetric>> {
    return this.create(this.prisma.analyticsMetric, data, schemas.analyticsMetric.omit({ id: true, createdAt: true, updatedAt: true }));
  }

  async findAnalyticsMetrics(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<AnalyticsMetric>> {
    return this.findMany(this.prisma.analyticsMetric, where, pagination);
  }

  async findMetricsByRole(roleId: string, category?: string): Promise<AnalyticsMetric[]> {
    const where: any = { roleId };
    if (category) where.category = category;
    
    return this.prisma.analyticsMetric.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
  }

  // Compliance operations
  async createComplianceRecord(data: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ComplianceRecord>> {
    return this.create(this.prisma.complianceRecord, data, schemas.complianceRecord.omit({ id: true, createdAt: true, updatedAt: true }));
  }

  async findComplianceRecords(
    where: any = {},
    pagination: { page: number; limit: number } = { page: 1, limit: 20 }
  ): Promise<PaginatedResponse<ComplianceRecord>> {
    return this.findMany(this.prisma.complianceRecord, where, pagination);
  }

  async findComplianceRecordsByUser(userId: string): Promise<ComplianceRecord[]> {
    return this.prisma.complianceRecord.findMany({
      where: { userId },
      include: {
        requirement: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Search and filtering
  async searchUsers(query: string, roleId?: string): Promise<User[]> {
    const where: any = {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    };
    
    if (roleId) where.roleId = roleId;
    
    return this.prisma.user.findMany({
      where,
      include: this.getIncludeOptions(this.prisma.user),
      take: 20,
    });
  }

  // Database health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }

  // Close database connection
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

// Export singleton instance
export const databaseService = DatabaseService.getInstance();

// Export types for convenience
export type { PrismaClient };
export { prisma };
