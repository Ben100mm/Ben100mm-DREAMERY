import { WorkflowStep, ProfessionalRole } from '../context/ProfessionalSupportContext';

// Workflow Engine using State Machine pattern
export class WorkflowEngine {
  private workflows: Map<string, WorkflowStep[]> = new Map();
  private workflowStates: Map<string, string> = new Map(); // workflowId -> current state

  constructor() {
    this.initializeDefaultWorkflows();
  }

  // Initialize default workflows for all professional roles
  private initializeDefaultWorkflows(): void {
    // Title Agent Workflow
    this.workflows.set('title-agent', [
      {
        id: 'order-intake',
        name: 'Order Intake',
        description: 'Receive and validate title order',
        order: 1,
        required: true,
        estimatedTime: 15,
        dependencies: [],
        status: 'pending',
      },
      {
        id: 'title-search',
        name: 'Title Search',
        description: 'Conduct comprehensive title search',
        order: 2,
        required: true,
        estimatedTime: 120,
        dependencies: ['order-intake'],
        status: 'pending',
      },
      {
        id: 'lien-check',
        name: 'Lien & Judgment Check',
        description: 'Search for liens, judgments, and encumbrances',
        order: 3,
        required: true,
        estimatedTime: 60,
        dependencies: ['title-search'],
        status: 'pending',
      },
      {
        id: 'clear-to-close',
        name: 'Clear to Close',
        description: 'Verify all requirements are met for closing',
        order: 4,
        required: true,
        estimatedTime: 45,
        dependencies: ['lien-check'],
        status: 'pending',
      },
      {
        id: 'settlement',
        name: 'Settlement',
        description: 'Prepare and execute settlement documents',
        order: 5,
        required: true,
        estimatedTime: 90,
        dependencies: ['clear-to-close'],
        status: 'pending',
      },
    ]);

    // Appraiser Workflow
    this.workflows.set('residential-appraiser', [
      {
        id: 'order-acceptance',
        name: 'Order Acceptance',
        description: 'Review and accept appraisal order',
        order: 1,
        required: true,
        estimatedTime: 15,
        dependencies: [],
        status: 'pending',
      },
      {
        id: 'property-inspection',
        name: 'Property Inspection',
        description: 'Conduct onsite property inspection',
        order: 2,
        required: true,
        estimatedTime: 180,
        dependencies: ['order-acceptance'],
        status: 'pending',
      },
      {
        id: 'market-analysis',
        name: 'Market Analysis',
        description: 'Research comparable sales and market trends',
        order: 3,
        required: true,
        estimatedTime: 120,
        dependencies: ['property-inspection'],
        status: 'pending',
      },
      {
        id: 'report-drafting',
        name: 'Report Drafting',
        description: 'Draft comprehensive appraisal report',
        order: 4,
        required: true,
        estimatedTime: 240,
        dependencies: ['market-analysis'],
        status: 'pending',
      },
      {
        id: 'qc-review',
        name: 'QC Review',
        description: 'Quality control review of report',
        order: 5,
        required: true,
        estimatedTime: 60,
        dependencies: ['report-drafting'],
        status: 'pending',
      },
      {
        id: 'report-delivery',
        name: 'Report Delivery',
        description: 'Deliver final report to client',
        order: 6,
        required: true,
        estimatedTime: 15,
        dependencies: ['qc-review'],
        status: 'pending',
      },
    ]);

    // Contractor Workflow
    this.workflows.set('general-contractor', [
      {
        id: 'bid-submission',
        name: 'Bid Submission',
        description: 'Submit competitive bid for project',
        order: 1,
        required: true,
        estimatedTime: 120,
        dependencies: [],
        status: 'pending',
      },
      {
        id: 'contract-execution',
        name: 'Contract Execution',
        description: 'Execute project contract and agreements',
        order: 2,
        required: true,
        estimatedTime: 60,
        dependencies: ['bid-submission'],
        status: 'pending',
      },
      {
        id: 'permits',
        name: 'Permit Management',
        description: 'Obtain necessary building permits',
        order: 3,
        required: true,
        estimatedTime: 240,
        dependencies: ['contract-execution'],
        status: 'pending',
      },
      {
        id: 'construction',
        name: 'Construction',
        description: 'Execute construction work according to plans',
        order: 4,
        required: true,
        estimatedTime: 14400, // 10 days
        dependencies: ['permits'],
        status: 'pending',
      },
      {
        id: 'change-orders',
        name: 'Change Orders',
        description: 'Process and execute change orders',
        order: 5,
        required: false,
        estimatedTime: 120,
        dependencies: ['construction'],
        status: 'pending',
      },
      {
        id: 'punch-list',
        name: 'Punch List',
        description: 'Complete punch list items',
        order: 6,
        required: true,
        estimatedTime: 480,
        dependencies: ['construction'],
        status: 'pending',
      },
      {
        id: 'completion',
        name: 'Project Completion',
        description: 'Final inspection and project closeout',
        order: 7,
        required: true,
        estimatedTime: 120,
        dependencies: ['punch-list'],
        status: 'pending',
      },
    ]);

    // Insurance Agent Workflow
    this.workflows.set('insurance-agent', [
      {
        id: 'risk-assessment',
        name: 'Risk Assessment',
        description: 'Assess client risk profile and needs',
        order: 1,
        required: true,
        estimatedTime: 60,
        dependencies: [],
        status: 'pending',
      },
      {
        id: 'quote-generation',
        name: 'Quote Generation',
        description: 'Generate insurance quotes from multiple carriers',
        order: 2,
        required: true,
        estimatedTime: 90,
        dependencies: ['risk-assessment'],
        status: 'pending',
      },
      {
        id: 'policy-binding',
        name: 'Policy Binding',
        description: 'Bind insurance policy with selected carrier',
        order: 3,
        required: true,
        estimatedTime: 30,
        dependencies: ['quote-generation'],
        status: 'pending',
      },
      {
        id: 'document-delivery',
        name: 'Document Delivery',
        description: 'Deliver policy documents and certificates',
        order: 4,
        required: true,
        estimatedTime: 15,
        dependencies: ['policy-binding'],
        status: 'pending',
      },
      {
        id: 'claims-support',
        name: 'Claims Support',
        description: 'Provide ongoing claims support and assistance',
        order: 5,
        required: false,
        estimatedTime: 60,
        dependencies: ['document-delivery'],
        status: 'pending',
      },
    ]);
  }

  // Get workflow for a specific role
  getWorkflow(roleId: string): WorkflowStep[] {
    return this.workflows.get(roleId) || [];
  }

  // Start a workflow
  startWorkflow(roleId: string): string {
    const workflow = this.getWorkflow(roleId);
    if (workflow.length === 0) {
      throw new Error(`No workflow found for role: ${roleId}`);
    }

    const workflowId = `${roleId}-${Date.now()}`;
    this.workflowStates.set(workflowId, 'started');
    
    // Reset all steps to pending
    workflow.forEach(step => {
      step.status = 'pending';
    });

    return workflowId;
  }

  // Get current workflow state
  getWorkflowState(workflowId: string): string {
    return this.workflowStates.get(workflowId) || 'not-found';
  }

  // Move workflow to next step
  nextStep(workflowId: string, roleId: string): WorkflowStep | null {
    const workflow = this.getWorkflow(roleId);
    const currentStep = workflow.find(step => step.status === 'in-progress');
    
    if (!currentStep) {
      // Start first step
      const firstStep = workflow.find(step => step.order === 1);
      if (firstStep) {
        firstStep.status = 'in-progress';
        this.workflowStates.set(workflowId, 'in-progress');
        return firstStep;
      }
      return null;
    }

    // Complete current step
    currentStep.status = 'completed';
    currentStep.completedAt = new Date();

    // Find next step
    const nextStep = workflow.find(step => 
      step.order === currentStep.order + 1 && 
      step.status === 'pending'
    );

    if (nextStep) {
      // Check dependencies
      const dependenciesMet = nextStep.dependencies.every(depId => {
        const depStep = workflow.find(step => step.id === depId);
        return depStep && depStep.status === 'completed';
      });

      if (dependenciesMet) {
        nextStep.status = 'in-progress';
        return nextStep;
      } else {
        nextStep.status = 'blocked';
        return null;
      }
    } else {
      // Workflow completed
      this.workflowStates.set(workflowId, 'completed');
      return null;
    }
  }

  // Complete a specific step
  completeStep(workflowId: string, roleId: string, stepId: string): boolean {
    const workflow = this.getWorkflow(roleId);
    const step = workflow.find(s => s.id === stepId);
    
    if (!step) {
      return false;
    }

    step.status = 'completed';
    step.completedAt = new Date();

    // Try to move to next step
    this.nextStep(workflowId, roleId);
    
    return true;
  }

  // Get workflow progress
  getWorkflowProgress(workflowId: string, roleId: string): {
    completed: number;
    total: number;
    percentage: number;
    currentStep: WorkflowStep | null;
    nextStep: WorkflowStep | null;
  } {
    const workflow = this.getWorkflow(roleId);
    const completed = workflow.filter(step => step.status === 'completed').length;
    const total = workflow.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const currentStep = workflow.find(step => step.status === 'in-progress');
    const nextStep = workflow.find(step => 
      step.status === 'pending' && 
      step.dependencies.every(depId => {
        const depStep = workflow.find(s => s.id === depId);
        return depStep && depStep.status === 'completed';
      })
    );

    return {
      completed,
      total,
      percentage,
      currentStep: currentStep || null,
      nextStep: nextStep || null,
    };
  }

  // Get blocked steps
  getBlockedSteps(workflowId: string, roleId: string): WorkflowStep[] {
    const workflow = this.getWorkflow(roleId);
    return workflow.filter(step => step.status === 'blocked');
  }

  // Get estimated completion time
  getEstimatedCompletionTime(workflowId: string, roleId: string): number {
    const workflow = this.getWorkflow(roleId);
    const remainingSteps = workflow.filter(step => 
      step.status === 'pending' || step.status === 'in-progress'
    );
    
    return remainingSteps.reduce((total, step) => total + step.estimatedTime, 0);
  }

  // Add custom workflow for a role
  addCustomWorkflow(roleId: string, workflow: WorkflowStep[]): void {
    this.workflows.set(roleId, workflow);
  }

  // Get all available workflows
  getAllWorkflows(): Map<string, WorkflowStep[]> {
    return new Map(this.workflows);
  }
}

// Export singleton instance
export const workflowEngine = new WorkflowEngine();
