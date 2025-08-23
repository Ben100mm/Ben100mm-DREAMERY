import { DocumentTemplate, TemplateVariable, ProfessionalRole } from '../context/ProfessionalSupportContext';

// Document Template Service for managing role-specific templates
export class DocumentTemplateService {
  private templates: Map<string, DocumentTemplate[]> = new Map();
  private templateSchemas: Map<string, any> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  // Initialize default document templates for all professional roles
  private initializeDefaultTemplates(): void {
    // Title Agent Templates
    this.templates.set('title-agent', [
      {
        id: 'title-commitment',
        name: 'Title Commitment',
        description: 'Standard title commitment letter',
        category: 'Legal Documents',
        template: 'title-commitment-template',
        variables: [
          { name: 'propertyAddress', type: 'string', required: true, validation: '^[\\w\\s,.-]+$' },
          { name: 'buyerName', type: 'string', required: true },
          { name: 'sellerName', type: 'string', required: true },
          { name: 'purchasePrice', type: 'number', required: true, validation: '^[0-9]+(\.[0-9]{2})?$' },
          { name: 'closingDate', type: 'date', required: true },
          { name: 'titleCompany', type: 'string', required: true },
          { name: 'exceptions', type: 'string', required: false },
        ],
        requiredFields: ['propertyAddress', 'buyerName', 'sellerName', 'purchasePrice', 'closingDate', 'titleCompany'],
        version: '1.0',
        lastUpdated: new Date(),
      },
      {
        id: 'settlement-statement',
        name: 'Settlement Statement',
        description: 'HUD-1 Settlement Statement',
        category: 'Closing Documents',
        template: 'settlement-statement-template',
        variables: [
          { name: 'propertyAddress', type: 'string', required: true },
          { name: 'buyerName', type: 'string', required: true },
          { name: 'sellerName', type: 'string', required: true },
          { name: 'purchasePrice', type: 'number', required: true },
          { name: 'closingDate', type: 'date', required: true },
          { name: 'titleInsurance', type: 'number', required: true },
          { name: 'recordingFees', type: 'number', required: true },
          { name: 'transferTaxes', type: 'number', required: true },
        ],
        requiredFields: ['propertyAddress', 'buyerName', 'sellerName', 'purchasePrice', 'closingDate'],
        version: '1.0',
        lastUpdated: new Date(),
      },
    ]);

    // Appraiser Templates
    this.templates.set('residential-appraiser', [
      {
        id: 'appraisal-report',
        name: 'Residential Appraisal Report',
        description: 'USPAP compliant residential appraisal report',
        category: 'Appraisal Reports',
        template: 'appraisal-report-template',
        variables: [
          { name: 'propertyAddress', type: 'string', required: true },
          { name: 'appraisedValue', type: 'number', required: true },
          { name: 'effectiveDate', type: 'date', required: true },
          { name: 'propertyType', type: 'select', required: true, options: ['Single Family', 'Townhouse', 'Condo', 'Multi-Family'] },
          { name: 'squareFootage', type: 'number', required: true },
          { name: 'bedrooms', type: 'number', required: true },
          { name: 'bathrooms', type: 'number', required: true },
          { name: 'yearBuilt', type: 'number', required: true },
          { name: 'condition', type: 'select', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor'] },
          { name: 'comparableSales', type: 'string', required: true },
        ],
        requiredFields: ['propertyAddress', 'appraisedValue', 'effectiveDate', 'propertyType', 'squareFootage'],
        version: '1.0',
        lastUpdated: new Date(),
      },
      {
        id: 'inspection-checklist',
        name: 'Property Inspection Checklist',
        description: 'Comprehensive property inspection checklist',
        category: 'Inspection Forms',
        template: 'inspection-checklist-template',
        variables: [
          { name: 'propertyAddress', type: 'string', required: true },
          { name: 'inspectionDate', type: 'date', required: true },
          { name: 'inspectorName', type: 'string', required: true },
          { name: 'weatherConditions', type: 'string', required: false },
          { name: 'accessibility', type: 'select', required: true, options: ['Full Access', 'Limited Access', 'No Access'] },
          { name: 'overallCondition', type: 'select', required: true, options: ['Excellent', 'Good', 'Fair', 'Poor'] },
        ],
        requiredFields: ['propertyAddress', 'inspectionDate', 'inspectorName', 'accessibility', 'overallCondition'],
        version: '1.0',
        lastUpdated: new Date(),
      },
    ]);

    // Contractor Templates
    this.templates.set('general-contractor', [
      {
        id: 'construction-contract',
        name: 'Construction Contract',
        description: 'Standard construction contract agreement',
        category: 'Contracts',
        template: 'construction-contract-template',
        variables: [
          { name: 'projectAddress', type: 'string', required: true },
          { name: 'contractorName', type: 'string', required: true },
          { name: 'clientName', type: 'string', required: true },
          { name: 'projectDescription', type: 'string', required: true },
          { name: 'contractAmount', type: 'number', required: true },
          { name: 'startDate', type: 'date', required: true },
          { name: 'completionDate', type: 'date', required: true },
          { name: 'paymentSchedule', type: 'select', required: true, options: ['Monthly', 'Milestone', 'Upon Completion'] },
          { name: 'warrantyPeriod', type: 'number', required: true },
        ],
        requiredFields: ['projectAddress', 'contractorName', 'clientName', 'projectDescription', 'contractAmount'],
        version: '1.0',
        lastUpdated: new Date(),
      },
      {
        id: 'change-order',
        name: 'Change Order',
        description: 'Construction change order form',
        category: 'Change Orders',
        template: 'change-order-template',
        variables: [
          { name: 'projectAddress', type: 'string', required: true },
          { name: 'changeOrderNumber', type: 'string', required: true },
          { name: 'changeDescription', type: 'string', required: true },
          { name: 'additionalCost', type: 'number', required: true },
          { name: 'timeExtension', type: 'number', required: false },
          { name: 'approvedBy', type: 'string', required: true },
          { name: 'approvalDate', type: 'date', required: true },
        ],
        requiredFields: ['projectAddress', 'changeOrderNumber', 'changeDescription', 'additionalCost', 'approvedBy'],
        version: '1.0',
        lastUpdated: new Date(),
      },
    ]);

    // Insurance Agent Templates
    this.templates.set('insurance-agent', [
      {
        id: 'insurance-quote',
        name: 'Insurance Quote',
        description: 'Property insurance quote form',
        category: 'Quotes',
        template: 'insurance-quote-template',
        variables: [
          { name: 'propertyAddress', type: 'string', required: true },
          { name: 'clientName', type: 'string', required: true },
          { name: 'coverageType', type: 'select', required: true, options: ['Dwelling', 'Personal Property', 'Liability', 'Medical Payments'] },
          { name: 'coverageAmount', type: 'number', required: true },
          { name: 'deductible', type: 'number', required: true },
          { name: 'annualPremium', type: 'number', required: true },
          { name: 'carrier', type: 'string', required: true },
          { name: 'quoteExpiry', type: 'date', required: true },
        ],
        requiredFields: ['propertyAddress', 'clientName', 'coverageType', 'coverageAmount', 'annualPremium'],
        version: '1.0',
        lastUpdated: new Date(),
      },
      {
        id: 'policy-binder',
        name: 'Policy Binder',
        description: 'Insurance policy binder document',
        category: 'Policy Documents',
        template: 'policy-binder-template',
        variables: [
          { name: 'policyNumber', type: 'string', required: true },
          { name: 'insuredName', type: 'string', required: true },
          { name: 'propertyAddress', type: 'string', required: true },
          { name: 'coverageDetails', type: 'string', required: true },
          { name: 'effectiveDate', type: 'date', required: true },
          { name: 'expirationDate', type: 'date', required: true },
          { name: 'premium', type: 'number', required: true },
          { name: 'carrier', type: 'string', required: true },
        ],
        requiredFields: ['policyNumber', 'insuredName', 'propertyAddress', 'coverageDetails', 'effectiveDate'],
        version: '1.0',
        lastUpdated: new Date(),
      },
    ]);
  }

  // Get templates for a specific role
  getTemplates(roleId: string): DocumentTemplate[] {
    return this.templates.get(roleId) || [];
  }

  // Get template by ID
  getTemplate(roleId: string, templateId: string): DocumentTemplate | null {
    const templates = this.getTemplates(roleId);
    return templates.find(t => t.id === templateId) || null;
  }

  // Get templates by category
  getTemplatesByCategory(roleId: string, category: string): DocumentTemplate[] {
    const templates = this.getTemplates(roleId);
    return templates.filter(t => t.category === category);
  }

  // Create new template
  createTemplate(roleId: string, template: Omit<DocumentTemplate, 'id' | 'version' | 'lastUpdated'>): DocumentTemplate {
    const newTemplate: DocumentTemplate = {
      ...template,
      id: `${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      version: '1.0',
      lastUpdated: new Date(),
    };

    const existingTemplates = this.getTemplates(roleId);
    existingTemplates.push(newTemplate);
    this.templates.set(roleId, existingTemplates);

    return newTemplate;
  }

  // Update existing template
  updateTemplate(roleId: string, templateId: string, updates: Partial<DocumentTemplate>): DocumentTemplate | null {
    const templates = this.getTemplates(roleId);
    const templateIndex = templates.findIndex(t => t.id === templateId);
    
    if (templateIndex === -1) {
      return null;
    }

    const updatedTemplate: DocumentTemplate = {
      ...templates[templateIndex],
      ...updates,
      lastUpdated: new Date(),
      version: (parseFloat(templates[templateIndex].version) + 0.1).toFixed(1),
    };

    templates[templateIndex] = updatedTemplate;
    this.templates.set(roleId, templates);

    return updatedTemplate;
  }

  // Delete template
  deleteTemplate(roleId: string, templateId: string): boolean {
    const templates = this.getTemplates(roleId);
    const filteredTemplates = templates.filter(t => t.id !== templateId);
    
    if (filteredTemplates.length === templates.length) {
      return false; // Template not found
    }

    this.templates.set(roleId, filteredTemplates);
    return true;
  }

  // Validate template variables
  validateTemplateVariables(template: DocumentTemplate, values: Record<string, any>): {
    isValid: boolean;
    errors: string[];
    missingFields: string[];
  } {
    const errors: string[] = [];
    const missingFields: string[] = [];

    // Check required fields
    template.requiredFields.forEach(field => {
      if (!values[field] || values[field] === '') {
        missingFields.push(field);
      }
    });

    // Validate field types and values
    template.variables.forEach(variable => {
      const value = values[variable.name];
      
      if (value !== undefined && value !== '') {
        // Type validation
        switch (variable.type) {
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(`${variable.name} must be a valid number`);
            }
            break;
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors.push(`${variable.name} must be a valid date`);
            }
            break;
          case 'select':
            if (variable.options && !variable.options.includes(value)) {
              errors.push(`${variable.name} must be one of: ${variable.options.join(', ')}`);
            }
            break;
        }

        // Custom validation
        if (variable.validation) {
          const regex = new RegExp(variable.validation);
          if (!regex.test(String(value))) {
            errors.push(`${variable.name} format is invalid`);
          }
        }
      }
    });

    return {
      isValid: errors.length === 0 && missingFields.length === 0,
      errors,
      missingFields,
    };
  }

  // Generate document from template
  generateDocument(template: DocumentTemplate, values: Record<string, any>): {
    success: boolean;
    document?: string;
    errors?: string[];
  } {
    const validation = this.validateTemplateVariables(template, values);
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: [...validation.errors, ...validation.missingFields.map(f => `${f} is required`)],
      };
    }

    // Simple template rendering (in production, use a proper templating engine)
    let documentContent = template.template;
    
    // Replace variables with values
    template.variables.forEach(variable => {
      const value = values[variable.name] || variable.defaultValue || '';
      const placeholder = `{{${variable.name}}}`;
      documentContent = documentContent.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return {
      success: true,
      document: documentContent,
    };
  }

  // Get template schema
  getTemplateSchema(templateId: string): any {
    return this.templateSchemas.get(templateId) || null;
  }

  // Set template schema
  setTemplateSchema(templateId: string, schema: any): void {
    this.templateSchemas.set(templateId, schema);
  }

  // Get all available templates
  getAllTemplates(): Map<string, DocumentTemplate[]> {
    return new Map(this.templates);
  }

  // Search templates
  searchTemplates(query: string, roleId?: string): DocumentTemplate[] {
    const allTemplates: DocumentTemplate[] = [];
    
    if (roleId) {
      allTemplates.push(...this.getTemplates(roleId));
    } else {
      this.templates.forEach(templates => {
        allTemplates.push(...templates);
      });
    }

    const searchTerm = query.toLowerCase();
    return allTemplates.filter(template =>
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm)
    );
  }
}

// Export singleton instance
export const documentTemplateService = new DocumentTemplateService();
