import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Professional categories data
const professionalCategories = [
  {
    id: 'acquisition-disposition',
    name: 'Acquisition & Disposition',
    description: 'Professionals involved in property acquisition and disposition processes',
  },
  {
    id: 'title-escrow',
    name: 'Title & Escrow',
    description: 'Professionals handling title insurance, escrow services, and closing processes',
  },
  {
    id: 'appraisal-inspection',
    name: 'Appraisal & Inspection',
    description: 'Professionals providing property valuation and inspection services',
  },
  {
    id: 'lending-financing',
    name: 'Lending & Financing',
    description: 'Professionals involved in mortgage lending and creative financing solutions',
  },
  {
    id: 'construction-renovation',
    name: 'Construction & Renovation',
    description: 'Professionals providing construction, renovation, and improvement services',
  },
  {
    id: 'design-interior',
    name: 'Design & Interior',
    description: 'Professionals providing design, interior decoration, and aesthetic services',
  },
  {
    id: 'property-management',
    name: 'Property Management',
    description: 'Professionals managing rental properties and tenant relationships',
  },
  {
    id: 'maintenance-services',
    name: 'Maintenance Services',
    description: 'Professionals providing property maintenance and cleaning services',
  },
  {
    id: 'tenant-services',
    name: 'Tenant Services',
    description: 'Professionals involved in tenant screening, leasing, and management',
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    description: 'Professionals providing accounting, tax, and financial advisory services',
  },
  {
    id: 'media-content',
    name: 'Media & Content',
    description: 'Professionals creating visual content and digital experiences',
  },
  {
    id: 'technology-development',
    name: 'Technology & Development',
    description: 'Professionals developing digital tools and virtual experiences',
  },
  {
    id: 'legal-services',
    name: 'Legal Services',
    description: 'Professionals providing legal representation and compliance services',
  },
  {
    id: 'exchange-formation',
    name: 'Exchange & Formation',
    description: 'Professionals handling 1031 exchanges and business entity formation',
  },
  {
    id: 'consulting-education',
    name: 'Consulting & Education',
    description: 'Professionals providing consulting and educational services',
  },
  {
    id: 'notary-services',
    name: 'Notary Services',
    description: 'Professionals providing notarization and legal verification services',
  },
  {
    id: 'financial-advisory',
    name: 'Financial Advisory',
    description: 'Professionals providing financial planning and investment advice',
  },
  {
    id: 'relocation-investment',
    name: 'Relocation & Investment',
    description: 'Professionals providing relocation services and investment advisory',
  },
];

// Professional roles data
const professionalRoles = [
  // Acquisition & Disposition
  {
    id: 'acquisition-specialist',
    name: 'Acquisition Specialist',
    categoryId: 'acquisition-disposition',
  },
  {
    id: 'disposition-agent',
    name: 'Disposition Agent',
    categoryId: 'acquisition-disposition',
  },

  // Title & Escrow
  {
    id: 'title-agent',
    name: 'Title Agent',
    categoryId: 'title-escrow',
  },
  {
    id: 'escrow-officer',
    name: 'Escrow Officer',
    categoryId: 'title-escrow',
  },
  {
    id: 'notary-public',
    name: 'Notary Public',
    categoryId: 'title-escrow',
  },

  // Appraisal & Inspection
  {
    id: 'residential-appraiser',
    name: 'Residential Appraiser',
    categoryId: 'appraisal-inspection',
  },
  {
    id: 'commercial-appraiser',
    name: 'Commercial Appraiser',
    categoryId: 'appraisal-inspection',
  },
  {
    id: 'commercial-inspector',
    name: 'Commercial Inspector',
    categoryId: 'appraisal-inspection',
  },
  {
    id: 'energy-inspector',
    name: 'Energy Inspector',
    categoryId: 'appraisal-inspection',
  },
  {
    id: 'land-surveyor',
    name: 'Land Surveyor',
    categoryId: 'appraisal-inspection',
  },

  // Lending & Financing
  {
    id: 'insurance-agent',
    name: 'Insurance Agent',
    categoryId: 'lending-financing',
  },
  {
    id: 'title-insurance-agent',
    name: 'Title Insurance Agent',
    categoryId: 'lending-financing',
  },
  {
    id: 'mortgage-broker',
    name: 'Mortgage Broker',
    categoryId: 'lending-financing',
  },
  {
    id: 'mortgage-lender',
    name: 'Mortgage Lender',
    categoryId: 'lending-financing',
  },
  {
    id: 'loan-officer',
    name: 'Loan Officer',
    categoryId: 'lending-financing',
  },
  {
    id: 'mortgage-underwriter',
    name: 'Mortgage Underwriter',
    categoryId: 'lending-financing',
  },
  {
    id: 'hard-money-lender',
    name: 'Hard Money Lender',
    categoryId: 'lending-financing',
  },
  {
    id: 'private-lender',
    name: 'Private Lender',
    categoryId: 'lending-financing',
  },
  {
    id: 'limited-partner',
    name: 'Limited Partner (LP)',
    categoryId: 'lending-financing',
  },

  // Creative Financing
  {
    id: 'seller-finance-purchase-specialist',
    name: 'Seller Finance Purchase Specialist',
    categoryId: 'lending-financing',
  },
  {
    id: 'subject-to-existing-mortgage-purchase-specialist',
    name: 'Subject To Existing Mortgage Purchase Specialist',
    categoryId: 'lending-financing',
  },
  {
    id: 'trust-acquisition-specialist',
    name: 'Trust Acquisition Specialist',
    categoryId: 'lending-financing',
  },
  {
    id: 'hybrid-purchase-specialist',
    name: 'Hybrid Purchase Specialist',
    categoryId: 'lending-financing',
  },
  {
    id: 'lease-option-specialist',
    name: 'Lease Option Specialist',
    categoryId: 'lending-financing',
  },

  // Construction & Renovation
  {
    id: 'general-contractor',
    name: 'General Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'electrical-contractor',
    name: 'Electrical Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'plumbing-contractor',
    name: 'Plumbing Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'hvac-contractor',
    name: 'HVAC Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'roofing-contractor',
    name: 'Roofing Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'painting-contractor',
    name: 'Painting Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'landscaping-contractor',
    name: 'Landscaping Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'flooring-contractor',
    name: 'Flooring Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'kitchen-contractor',
    name: 'Kitchen Contractor',
    categoryId: 'construction-renovation',
  },
  {
    id: 'bathroom-contractor',
    name: 'Bathroom Contractor',
    categoryId: 'construction-renovation',
  },

  // Design & Interior
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    categoryId: 'design-interior',
  },
  {
    id: 'architect',
    name: 'Architect',
    categoryId: 'design-interior',
  },
  {
    id: 'landscape-architect',
    name: 'Landscape Architect',
    categoryId: 'design-interior',
  },
  {
    id: 'kitchen-designer',
    name: 'Kitchen Designer',
    categoryId: 'design-interior',
  },
  {
    id: 'bathroom-designer',
    name: 'Bathroom Designer',
    categoryId: 'design-interior',
  },
  {
    id: 'lighting-designer',
    name: 'Lighting Designer',
    categoryId: 'design-interior',
  },
  {
    id: 'furniture-designer',
    name: 'Furniture Designer',
    categoryId: 'design-interior',
  },
  {
    id: 'color-consultant',
    name: 'Color Consultant',
    categoryId: 'design-interior',
  },

  // Property Management
  {
    id: 'property-manager',
    name: 'Property Manager',
    categoryId: 'property-management',
  },
  {
    id: 'long-term-rental-manager',
    name: 'Long-term Rental Property Manager',
    categoryId: 'property-management',
  },
  {
    id: 'short-term-rental-manager',
    name: 'Short-term Rental Property Manager',
    categoryId: 'property-management',
  },

  // Maintenance Services
  {
    id: 'permit-expeditor',
    name: 'Permit Expeditor',
    categoryId: 'maintenance-services',
  },
  {
    id: 'str-setup-manager',
    name: 'STR Setup & Manager',
    categoryId: 'maintenance-services',
  },
  {
    id: 'housekeeper',
    name: 'Housekeeper',
    categoryId: 'maintenance-services',
  },
  {
    id: 'landscape-cleaner',
    name: 'Landscape Cleaner',
    categoryId: 'maintenance-services',
  },
  {
    id: 'turnover-specialist',
    name: 'Turnover Specialist',
    categoryId: 'maintenance-services',
  },
  {
    id: 'handyman',
    name: 'Handyman',
    categoryId: 'maintenance-services',
  },
  {
    id: 'landscaper',
    name: 'Landscaper',
    categoryId: 'maintenance-services',
  },
  {
    id: 'arborist',
    name: 'Arborist',
    categoryId: 'maintenance-services',
  },

  // Tenant Services
  {
    id: 'tenant-screening-agent',
    name: 'Tenant Screening Agent',
    categoryId: 'tenant-services',
  },
  {
    id: 'leasing-agent',
    name: 'Leasing Agent',
    categoryId: 'tenant-services',
  },

  // Financial Services
  {
    id: 'bookkeeper',
    name: 'Bookkeeper',
    categoryId: 'financial-services',
  },
  {
    id: 'cpa',
    name: 'CPA',
    categoryId: 'financial-services',
  },
  {
    id: 'accountant',
    name: 'Accountant',
    categoryId: 'financial-services',
  },

  // Media & Content
  {
    id: 'photographer',
    name: 'Photographer',
    categoryId: 'media-content',
  },
  {
    id: 'videographer',
    name: 'Videographer',
    categoryId: 'media-content',
  },

  // Technology & Development
  {
    id: 'ar-vr-developer',
    name: 'AR/VR Developer',
    categoryId: 'technology-development',
  },
  {
    id: 'digital-twins-developer',
    name: 'Digital Twins Developer',
    categoryId: 'technology-development',
  },

  // Legal Services
  {
    id: 'real-estate-attorney',
    name: 'Real Estate Attorney',
    categoryId: 'legal-services',
  },
  {
    id: 'estate-planning-attorney',
    name: 'Estate Planning Attorney',
    categoryId: 'legal-services',
  },

  // Exchange & Formation
  {
    id: '1031-exchange-intermediary',
    name: '1031 Exchange Intermediary',
    categoryId: 'exchange-formation',
  },
  {
    id: 'entity-formation-service-provider',
    name: 'Entity Formation Service Provider',
    categoryId: 'exchange-formation',
  },
  {
    id: 'escrow-service-provider',
    name: 'Escrow Service Provider',
    categoryId: 'exchange-formation',
  },

  // Consulting & Education
  {
    id: 'real-estate-consultant',
    name: 'Real Estate Consultant',
    categoryId: 'consulting-education',
  },
  {
    id: 'real-estate-educator',
    name: 'Real Estate Educator',
    categoryId: 'consulting-education',
  },

  // Notary Services
  {
    id: 'legal-notary-service-provider',
    name: 'Legal Notary Service Provider',
    categoryId: 'notary-services',
  },

  // Financial Advisory
  {
    id: 'financial-advisor',
    name: 'Financial Advisor',
    categoryId: 'financial-advisory',
  },
  {
    id: 'tax-advisor',
    name: 'Tax Advisor',
    categoryId: 'financial-advisory',
  },

  // Relocation & Investment
  {
    id: 'relocation-specialist',
    name: 'Relocation Specialist',
    categoryId: 'relocation-investment',
  },
  {
    id: 'real-estate-investment-advisor',
    name: 'Real Estate Investment Advisor',
    categoryId: 'relocation-investment',
  },
];

// Sample workflows for different roles
const sampleWorkflows = [
  {
    id: 'acquisition-workflow',
    name: 'Property Acquisition Workflow',
    description: 'Standard workflow for property acquisition process',
    roleId: 'acquisition-specialist',
    steps: [
      {
        id: 'step-1',
        name: 'Property Identification',
        description: 'Identify potential properties for acquisition',
        order: 1,
        status: 'pending',
        data: {},
        requiredFields: ['propertyAddress', 'propertyType'],
        validationRules: [],
        estimatedDuration: 60,
        dependencies: [],
      },
      {
        id: 'step-2',
        name: 'Due Diligence',
        description: 'Conduct thorough property investigation',
        order: 2,
        status: 'pending',
        data: {},
        requiredFields: ['inspectionReport', 'titleSearch'],
        validationRules: [],
        estimatedDuration: 120,
        dependencies: ['step-1'],
      },
    ],
  },
];

// Sample document templates
const sampleDocumentTemplates = [
  {
    id: 'purchase-agreement-template',
    name: 'Standard Purchase Agreement',
    description: 'Standard purchase agreement template for real estate transactions',
    roleId: 'acquisition-specialist',
    category: 'contract',
    content: 'This is a sample purchase agreement template...',
    variables: [
      { name: 'buyerName', type: 'string', required: true },
      { name: 'sellerName', type: 'string', required: true },
      { name: 'propertyAddress', type: 'string', required: true },
      { name: 'purchasePrice', type: 'number', required: true },
    ],
    version: '1.0',
  },
];

// Sample compliance requirements
const sampleComplianceRequirements = [
  {
    id: 'license-requirement',
    name: 'Professional License Requirement',
    description: 'Maintain valid professional license',
    roleId: 'acquisition-specialist',
    category: 'licensing',
    requirements: [
      {
        id: 'license-check',
        name: 'License Verification',
        description: 'Verify current license status',
        isRequired: true,
        evidenceRequired: true,
        evidenceTypes: ['pdf', 'image'],
        verificationMethod: 'manual',
      },
    ],
    frequency: 'annually',
  },
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.auditLog.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.reminder.deleteMany();
    await prisma.task.deleteMany();
    await prisma.analyticsMetric.deleteMany();
    await prisma.analyticsDashboard.deleteMany();
    await prisma.complianceRecord.deleteMany();
    await prisma.complianceRequirement.deleteMany();
    await prisma.documentInstance.deleteMany();
    await prisma.documentTemplate.deleteMany();
    await prisma.workflowStep.deleteMany();
    await prisma.workflow.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.professionalCategory.deleteMany();

    // Create professional categories
    console.log('📚 Creating professional categories...');
    for (const category of professionalCategories) {
      await prisma.professionalCategory.create({
        data: {
          id: category.id,
          name: category.name,
          description: category.description,
        },
      });
    }

    // Create professional roles
    console.log('👥 Creating professional roles...');
    for (const role of professionalRoles) {
      await prisma.userRole.create({
        data: {
          id: role.id,
          name: role.name,
          categoryId: role.categoryId,
        },
      });
    }

    // Create sample workflows
    console.log('🔄 Creating sample workflows...');
    for (const workflow of sampleWorkflows) {
      const createdWorkflow = await prisma.workflow.create({
        data: {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description,
          roleId: workflow.roleId,
        },
      });

      // Create workflow steps
      for (const step of workflow.steps) {
        await prisma.workflowStep.create({
          data: {
            id: step.id,
            workflowId: createdWorkflow.id,
            name: step.name,
            description: step.description,
            order: step.order,
            status: step.status,
            data: step.data,
            requiredFields: step.requiredFields,
            validationRules: step.validationRules,
            estimatedDuration: step.estimatedDuration,
            dependencies: step.dependencies,
          },
        });
      }
    }

    // Create sample document templates
    console.log('📄 Creating sample document templates...');
    for (const template of sampleDocumentTemplates) {
      await prisma.documentTemplate.create({
        data: {
          id: template.id,
          name: template.name,
          description: template.description,
          roleId: template.roleId,
          category: template.category,
          content: template.content,
          variables: template.variables,
          version: template.version,
        },
      });
    }

    // Create sample compliance requirements
    console.log('✅ Creating sample compliance requirements...');
    for (const requirement of sampleComplianceRequirements) {
      await prisma.complianceRequirement.create({
        data: {
          id: requirement.id,
          name: requirement.name,
          description: requirement.description,
          roleId: requirement.roleId,
          category: requirement.category,
          requirements: requirement.requirements,
          frequency: requirement.frequency,
        },
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created ${professionalCategories.length} professional categories`);
    console.log(`👥 Created ${professionalRoles.length} professional roles`);
    console.log(`🔄 Created ${sampleWorkflows.length} sample workflows`);
    console.log(`📄 Created ${sampleDocumentTemplates.length} document templates`);
    console.log(`✅ Created ${sampleComplianceRequirements.length} compliance requirements`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  main()
    .then(() => {
      console.log('🎉 Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { main as seedDatabase };
