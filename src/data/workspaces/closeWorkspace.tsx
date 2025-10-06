import {
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  Calculate as CalculateIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Support as SupportIcon,
  IntegrationInstructions as IntegrationIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import ClosingAssistantIcon from '../../components/close/ai-closing-assistant/ClosingAssistantIcon';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const closeWorkspace: WorkspaceConfig = {
  id: 'close',
  name: 'Close',
  description: 'Closing and transaction management',
  icon: <SecurityIcon />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
    },
    { 
      id: 'escrow-title', 
      label: 'Escrow & Title', 
      icon: <SecurityIcon />,
    },
    { 
      id: 'due-diligence', 
      label: 'Due Diligence', 
      icon: <SearchIcon />,
    },
    { 
      id: 'financing', 
      label: 'Financing', 
      icon: <AccountBalanceIcon />,
    },
    { 
      id: 'legal', 
      label: 'Legal & Compliance', 
      icon: <GavelIcon />,
    },
    { 
      id: 'settlement', 
      label: 'Settlement', 
      icon: <CalculateIcon />,
    },
    { 
      id: 'insurance', 
      label: 'Insurance & Utilities', 
      icon: <HomeIcon />,
    },
    { 
      id: 'walkthrough', 
      label: 'Walkthrough', 
      icon: <CheckCircleIcon />,
    },
    { 
      id: 'post-closing', 
      label: 'Post-Closing', 
      icon: <SupportIcon />,
    },
    { 
      id: 'assistant', 
      label: 'Closing Assistant', 
      icon: <ClosingAssistantIcon size={20} variant="icon" />,
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: <ChatIcon />,
    },
    { 
      id: 'integrations', 
      label: 'Integrations', 
      icon: <IntegrationIcon />,
    },
  ],
};
