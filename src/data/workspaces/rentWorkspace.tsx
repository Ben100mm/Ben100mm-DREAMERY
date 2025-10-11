import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  Assignment as ApplicationIcon,
  Payment as PaymentIcon,
  Chat as ChatIcon,
  Description as DocumentIcon,
  CalendarToday as CalendarIcon,
  SmartToy as AssistantIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const rentWorkspace: WorkspaceConfig = {
  id: 'rent',
  name: 'Rent',
  description: 'Rental property search and management',
  icon: <SearchIcon />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
    },
    { 
      id: 'search', 
      label: 'Property Search', 
      icon: <SearchIcon />,
    },
    { 
      id: 'favorites', 
      label: 'Saved Properties', 
      icon: <FavoriteIcon />,
    },
    { 
      id: 'applications', 
      label: 'Applications', 
      icon: <ApplicationIcon />,
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <PaymentIcon />,
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: <ChatIcon />,
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      icon: <DocumentIcon />,
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: <CalendarIcon />,
    },
    { 
      id: 'assistant', 
      label: 'Rental Assistant', 
      icon: <AssistantIcon />,
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <AnalyticsIcon />,
    },
  ],
};

