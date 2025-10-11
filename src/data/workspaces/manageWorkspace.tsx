import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Home as ListingIcon,
  Chat as ChatIcon,
  AttachMoney as EarningsIcon,
  Insights as InsightsIcon,
  Add as CreateListingIcon,
  Assignment as LeaseIcon,
  PersonAdd as ApplicationIcon,
  Payment as PaymentIcon,
  IntegrationInstructions as IntegrationIcon,
  Security as InsuranceIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const manageWorkspace: WorkspaceConfig = {
  id: 'manage',
  name: 'Manage',
  description: 'Property management and rental operations',
  icon: <DashboardIcon />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: <CalendarIcon />,
    },
    { 
      id: 'listings', 
      label: 'Listings', 
      icon: <ListingIcon />,
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: <ChatIcon />,
    },
    { 
      id: 'earnings', 
      label: 'Earnings', 
      icon: <EarningsIcon />,
    },
    { 
      id: 'insights', 
      label: 'Insights', 
      icon: <InsightsIcon />,
    },
    { 
      id: 'listing', 
      label: 'Creating a Listing', 
      icon: <CreateListingIcon />,
    },
    { 
      id: 'leases', 
      label: 'Online Leases', 
      icon: <LeaseIcon />,
    },
    { 
      id: 'applications', 
      label: 'Rental Applications', 
      icon: <ApplicationIcon />,
    },
    { 
      id: 'payments', 
      label: 'Payment Collections', 
      icon: <PaymentIcon />,
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: <IntegrationIcon />,
    },
    { 
      id: 'insurance', 
      label: 'Insurance', 
      icon: <InsuranceIcon />,
    },
    { 
      id: 'account', 
      label: 'Manage Your Account', 
      icon: <AccountIcon />,
    },
  ],
};
