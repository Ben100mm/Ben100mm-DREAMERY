import { ComplianceChecklist, ComplianceItem, ProfessionalRole } from '../context/ProfessionalSupportContext';

// Compliance Service for managing role-specific compliance checklists
export class ComplianceService {
  private checklists: Map<string, ComplianceChecklist[]> = new Map();
  private checklistProgress: Map<string, Record<string, any>> = new Map(); // roleId -> checklistId -> progress

  constructor() {
    this.initializeDefaultChecklists();
  }

  // Initialize default compliance checklists for all professional roles
  private initializeDefaultChecklists(): void {
    // Title Agent Compliance
    this.checklists.set('title-agent', [
      {
        id: 'title-search-compliance',
        name: 'Title Search Compliance',
        description: 'Required compliance items for title search process',
        category: 'Title Search',
        items: [
          {
            id: 'property-identification',
            description: 'Verify property legal description and address',
            required: true,
            completed: false,
          },
          {
            id: 'ownership-verification',
            description: 'Verify current ownership and chain of title',
            required: true,
            completed: false,
          },
          {
            id: 'lien-search',
            description: 'Search for outstanding liens and judgments',
            required: true,
            completed: false,
          },
          {
            id: 'tax-status',
            description: 'Verify property tax status and payments',
            required: true,
            completed: false,
          },
          {
            id: 'survey-review',
            description: 'Review property survey for encroachments',
            required: false,
            completed: false,
          },
        ],
        required: true,
        frequency: 'once',
      },
      {
        id: 'settlement-compliance',
        name: 'Settlement Compliance',
        description: 'Required compliance items for settlement process',
        category: 'Settlement',
        items: [
          {
            id: 'hud-1-review',
            description: 'Review and approve HUD-1 Settlement Statement',
            required: true,
            completed: false,
          },
          {
            id: 'funding-verification',
            description: 'Verify all funding requirements are met',
            required: true,
            completed: false,
          },
          {
            id: 'document-execution',
            description: 'Ensure all required documents are executed',
            required: true,
            completed: false,
          },
          {
            id: 'recording-verification',
            description: 'Verify all documents are properly recorded',
            required: true,
            completed: false,
          },
        ],
        required: true,
        frequency: 'once',
      },
    ]);

    // Appraiser Compliance
    this.checklists.set('residential-appraiser', [
      {
        id: 'uspap-compliance',
        name: 'USPAP Compliance',
        description: 'USPAP compliance requirements for residential appraisals',
        category: 'USPAP Standards',
        items: [
          {
            id: 'scope-of-work',
            description: 'Define and document scope of work',
            required: true,
            completed: false,
          },
          {
            id: 'property-inspection',
            description: 'Conduct onsite property inspection',
            required: true,
            completed: false,
          },
          {
            id: 'market-analysis',
            description: 'Perform market analysis with comparables',
            required: true,
            completed: false,
          },
          {
            id: 'value-conclusion',
            description: 'Develop and support value conclusion',
            required: true,
            completed: false,
          },
          {
            id: 'report-delivery',
            description: 'Deliver appraisal report to client',
            required: true,
            completed: false,
          },
        ],
        required: true,
        frequency: 'once',
      },
      {
        id: 'quality-control',
        name: 'Quality Control Review',
        description: 'Quality control requirements for appraisal reports',
        category: 'Quality Control',
        items: [
          {
            id: 'data-verification',
            description: 'Verify all data sources and accuracy',
            required: true,
            completed: false,
          },
          {
            id: 'calculation-review',
            description: 'Review all calculations and adjustments',
            required: true,
            completed: false,
          },
          {
            id: 'report-formatting',
            description: 'Ensure report meets formatting requirements',
            required: true,
            completed: false,
          },
          {
            id: 'peer-review',
            description: 'Conduct peer review of final report',
            required: false,
            completed: false,
          },
        ],
        required: true,
        frequency: 'once',
      },
    ]);

    // Contractor Compliance
    this.checklists.set('general-contractor', [
      {
        id: 'permitting-compliance',
        name: 'Permitting Compliance',
        description: 'Required compliance items for construction permits',
        category: 'Permits',
        items: [
          {
            id: 'permit-application',
            description: 'Submit complete permit application',
            required: true,
            completed: false,
          },
          {
            id: 'plan-review',
            description: 'Complete plan review process',
            required: true,
            completed: false,
          },
          {
            id: 'permit-issuance',
            description: 'Obtain building permit',
            required: true,
            completed: false,
          },
          {
            id: 'inspections',
            description: 'Schedule and complete required inspections',
            required: true,
            completed: false,
          },
          {
            id: 'final-approval',
            description: 'Obtain final approval and certificate of occupancy',
            required: true,
            completed: false,
          },
        ],
        required: true,
        frequency: 'once',
      },
      {
        id: 'safety-compliance',
        name: 'Safety Compliance',
        description: 'Required safety compliance items for construction',
        category: 'Safety',
        items: [
          {
            id: 'safety-training',
            description: 'Ensure all workers have safety training',
            required: true,
            completed: false,
          },
          {
            id: 'ppe-verification',
            description: 'Verify proper PPE is available and used',
            required: true,
            completed: false,
          },
          {
            id: 'site-safety',
            description: 'Conduct daily site safety inspections',
            required: true,
            completed: false,
          },
          {
            id: 'incident-reporting',
            description: 'Establish incident reporting procedures',
            required: true,
            completed: false,
          },
        ],
        required: true,
        frequency: 'daily',
      },
    ]);

    // Insurance Agent Compliance
    this.checklists.set('insurance-agent', [
      {
        id: 'licensing-compliance',
        name: 'Licensing Compliance',
        description: 'Required compliance items for insurance licensing',
        category: 'Licensing',
        items: [
          {
            id: 'license-verification',
            description: 'Verify current license status and expiration',
            required: true,
            completed: false,
          },
          {
            id: 'ce-requirements',
            description: 'Complete continuing education requirements',
            required: true,
            completed: false,
          },
          {
            id: 'bond-verification',
            description: 'Verify surety bond is current and sufficient',
            required: true,
            completed: false,
          },
          {
            id: 'appointment-verification',
            description: 'Verify carrier appointments are current',
            required: true,
            completed: false,
          },
        ],
        required: true,
        frequency: 'yearly',
      },
      {
        id: 'policy-compliance',
        name: 'Policy Compliance',
        description: 'Required compliance items for policy management',
        category: 'Policy Management',
        items: [
          {
            id: 'disclosure-requirements',
            description: 'Provide required policy disclosures to clients',
            required: true,
            completed: false,
          },
          {
            id: 'policy-delivery',
            description: 'Deliver policy documents within required timeframe',
            required: true,
            completed: false,
          },
          {
            id: 'claims-assistance',
            description: 'Provide claims assistance and support',
            required: true,
            completed: false,
          },
          {
            id: 'renewal-notification',
            description: 'Send renewal notifications to clients',
            required: true,
            completed: false,
          },
        ],
        required: true,
        // Frequency options are limited to: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
        // Policy-related items should be checked yearly by default
        frequency: 'yearly',
      },
    ]);
  }

  // Get compliance checklists for a specific role
  getChecklists(roleId: string): ComplianceChecklist[] {
    return this.checklists.get(roleId) || [];
  }

  // Get checklist by ID
  getChecklist(roleId: string, checklistId: string): ComplianceChecklist | null {
    const checklists = this.getChecklists(roleId);
    return checklists.find(c => c.id === checklistId) || null;
  }

  // Get checklists by category
  getChecklistsByCategory(roleId: string, category: string): ComplianceChecklist[] {
    const checklists = this.getChecklists(roleId);
    return checklists.filter(c => c.category === category);
  }

  // Get checklist progress
  getChecklistProgress(roleId: string, checklistId: string): Record<string, any> {
    const key = `${roleId}-${checklistId}`;
    return this.checklistProgress.get(key) || {};
  }

  // Update checklist item
  updateChecklistItem(
    roleId: string,
    checklistId: string,
    itemId: string,
    updates: Partial<ComplianceItem>
  ): boolean {
    const checklist = this.getChecklist(roleId, checklistId);
    if (!checklist) {
      return false;
    }

    const itemIndex = checklist.items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return false;
    }

    // Update the item
    checklist.items[itemIndex] = {
      ...checklist.items[itemIndex],
      ...updates,
      completedAt: updates.completed ? new Date() : undefined,
    };

    // Update progress
    this.updateProgress(roleId, checklistId);

    return true;
  }

  // Update checklist progress
  private updateProgress(roleId: string, checklistId: string): void {
    const checklist = this.getChecklist(roleId, checklistId);
    if (!checklist) {
      return;
    }

    const key = `${roleId}-${checklistId}`;
    const completedItems = checklist.items.filter(item => item.completed).length;
    const totalItems = checklist.items.length;
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const progress = {
      completedItems,
      totalItems,
      percentage,
      lastUpdated: new Date(),
      isComplete: completedItems === totalItems,
    };

    this.checklistProgress.set(key, progress);
  }

  // Get overall compliance status for a role
  getRoleComplianceStatus(roleId: string): {
    totalChecklists: number;
    completedChecklists: number;
    overallPercentage: number;
    overdueItems: ComplianceItem[];
    upcomingDueItems: ComplianceItem[];
  } {
    const checklists = this.getChecklists(roleId);
    let totalChecklists = 0;
    let completedChecklists = 0;
    const overdueItems: ComplianceItem[] = [];
    const upcomingDueItems: ComplianceItem[] = [];

    checklists.forEach(checklist => {
      if (checklist.required) {
        totalChecklists++;
        
        const progress = this.getChecklistProgress(roleId, checklist.id);
        if (progress.isComplete) {
          completedChecklists++;
        }

        // Check for overdue items
        checklist.items.forEach(item => {
          if (item.completed && checklist.frequency !== 'once') {
            const nextDue = this.calculateNextDue(checklist.frequency, item.completedAt!);
            if (nextDue < new Date()) {
              overdueItems.push(item);
            } else if (this.isUpcomingDue(nextDue)) {
              upcomingDueItems.push(item);
            }
          }
        });
      }
    });

    const overallPercentage = totalChecklists > 0 ? Math.round((completedChecklists / totalChecklists) * 100) : 0;

    return {
      totalChecklists,
      completedChecklists,
      overallPercentage,
      overdueItems,
      upcomingDueItems,
    };
  }

  // Calculate next due date based on frequency
  private calculateNextDue(frequency: string, lastCompleted: Date): Date {
    const nextDue = new Date(lastCompleted);
    
    switch (frequency) {
      case 'daily':
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case 'weekly':
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case 'monthly':
        nextDue.setMonth(nextDue.getMonth() + 1);
        break;
      case 'yearly':
        nextDue.setFullYear(nextDue.getFullYear() + 1);
        break;
      default:
        // 'once' - no next due date
        return new Date(0);
    }

    return nextDue;
  }

  // Check if item is upcoming due (within 7 days)
  private isUpcomingDue(dueDate: Date): boolean {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate <= sevenDaysFromNow && dueDate > now;
  }

  // Create new checklist
  createChecklist(roleId: string, checklist: Omit<ComplianceChecklist, 'id'>): ComplianceChecklist {
    const newChecklist: ComplianceChecklist = {
      ...checklist,
      id: `${checklist.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    };

    const existingChecklists = this.getChecklists(roleId);
    existingChecklists.push(newChecklist);
    this.checklists.set(roleId, existingChecklists);

    return newChecklist;
  }

  // Update existing checklist
  updateChecklist(roleId: string, checklistId: string, updates: Partial<ComplianceChecklist>): ComplianceChecklist | null {
    const checklists = this.getChecklists(roleId);
    const checklistIndex = checklists.findIndex(c => c.id === checklistId);
    
    if (checklistIndex === -1) {
      return null;
    }

    const updatedChecklist: ComplianceChecklist = {
      ...checklists[checklistIndex],
      ...updates,
    };

    checklists[checklistIndex] = updatedChecklist;
    this.checklists.set(roleId, checklists);

    return updatedChecklist;
  }

  // Delete checklist
  deleteChecklist(roleId: string, checklistId: string): boolean {
    const checklists = this.getChecklists(roleId);
    const filteredChecklists = checklists.filter(c => c.id !== checklistId);
    
    if (filteredChecklists.length === checklists.length) {
      return false; // Checklist not found
    }

    this.checklists.set(roleId, filteredChecklists);
    
    // Remove progress data
    const key = `${roleId}-${checklistId}`;
    this.checklistProgress.delete(key);

    return true;
  }

  // Get compliance report
  getComplianceReport(roleId: string): {
    roleId: string;
    reportDate: Date;
    overallStatus: string;
    checklists: Array<{
      checklist: ComplianceChecklist;
      progress: Record<string, any>;
      status: string;
    }>;
    summary: {
      totalRequired: number;
      completed: number;
      overdue: number;
      upcoming: number;
    };
  } {
    const checklists = this.getChecklists(roleId);
    const overallStatus = this.getRoleComplianceStatus(roleId);
    
    const checklistReports = checklists.map(checklist => {
      const progress = this.getChecklistProgress(roleId, checklist.id);
      let status = 'Not Started';
      
      if (progress.isComplete) {
        status = 'Completed';
      } else if (progress.percentage > 0) {
        status = 'In Progress';
      }

      return {
        checklist,
        progress,
        status,
      };
    });

    const summary = {
      totalRequired: overallStatus.totalChecklists,
      completed: overallStatus.completedChecklists,
      overdue: overallStatus.overdueItems.length,
      upcoming: overallStatus.upcomingDueItems.length,
    };

    return {
      roleId,
      reportDate: new Date(),
      overallStatus: overallStatus.overallPercentage >= 90 ? 'Compliant' : 
                   overallStatus.overallPercentage >= 70 ? 'Partially Compliant' : 'Non-Compliant',
      checklists: checklistReports,
      summary,
    };
  }

  // Export compliance data
  exportComplianceData(roleId: string): string {
    const report = this.getComplianceReport(roleId);
    return JSON.stringify(report, null, 2);
  }

  // Get all available checklists
  getAllChecklists(): Map<string, ComplianceChecklist[]> {
    return new Map(this.checklists);
  }

  // Search checklists
  searchChecklists(query: string, roleId?: string): ComplianceChecklist[] {
    const allChecklists: ComplianceChecklist[] = [];
    
    if (roleId) {
      allChecklists.push(...this.getChecklists(roleId));
    } else {
      this.checklists.forEach(checklists => {
        allChecklists.push(...checklists);
      });
    }

    const searchTerm = query.toLowerCase();
    return allChecklists.filter(checklist =>
      checklist.name.toLowerCase().includes(searchTerm) ||
      checklist.description.toLowerCase().includes(searchTerm) ||
      checklist.category.toLowerCase().includes(searchTerm)
    );
  }
}

// Export singleton instance
export const complianceService = new ComplianceService();
