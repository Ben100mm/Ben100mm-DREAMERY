import {
  Dashboard as DashboardIcon,
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  Receipt as ExpenseIcon,
  Schedule as ContractorIcon,
  TrendingUp as OptimizationIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const operateWorkspace: WorkspaceConfig = {
  id: 'operate',
  name: 'Operate',
  description: 'Property operations and project management',
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
      id: 'projects', 
      label: 'Projects', 
      icon: <ProjectsIcon />,
    },
    { 
      id: 'createproject', 
      label: 'Create a New Project', 
      icon: <CreateProjectIcon />,
    },
    { 
      id: 'expenses', 
      label: 'Expense Tracking', 
      icon: <ExpenseIcon />,
    },
    { 
      id: 'contractors', 
      label: 'Contractor & Vendor Scheduling', 
      icon: <ContractorIcon />,
    },
    { 
      id: 'optimization', 
      label: 'Portfolio Optimization Suggestions', 
      icon: <OptimizationIcon />,
    },
    { 
      id: 'messages', 
      label: 'Messages', 
      icon: <ChatIcon />,
    },
  ],
};
