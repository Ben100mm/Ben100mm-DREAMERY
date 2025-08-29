// Agent role definitions and permissions
export const AGENT_ROLES = {
  BUYING: [
    'Real Estate Agent',
    'Buyer\'s Agent', 
    'Wholesaler',
    'Realtor'
  ],
  LISTING: [
    'Listing Agent',
    'Commercial Agent',
    'Luxury Agent',
    'New Construction Agent',
    'Disposition Agent'
  ]
} as const;

export const TAB_ORDER = [
  'LISTING',
  'CONTACTS', 
  'PHOTOS',
  'DOCUMENTS',
  'CHECKLIST',
  'TASKS',
  'LOG'
] as const;

export const DEFAULT_TAB_COMPLETION = {
  LISTING: false,
  PHOTOS: false,
  CONTACTS: false,
  CHECKLIST: false,
  DOCUMENTS: false,
  LOG: false,
  TASKS: false
} as const;

export const DEFAULT_USER_ROLE = {
  id: 'agent-001',
  name: 'Sarah Johnson',
  permissions: ['view_clients', 'manage_transactions', 'generate_reports'],
  level: 'agent'
} as const;
