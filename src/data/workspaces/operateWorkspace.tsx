import {
  Dashboard as DashboardIcon,
  Chat as MessageIcon,
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  Receipt as ExpenseIcon,
  Schedule as ContractorIcon,
  TrendingUp as OptimizationIcon,
  Campaign as AdvertiseIcon,
} from '@mui/icons-material';
import OperateAssistantIcon from '../../components/operate/ai-operate-assistant/OperateAssistantIcon';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const operateWorkspace: WorkspaceConfig = {
  id: 'operate',
  name: 'Operate',
  description: 'Fix & Flip, BRRR, and Land Development/Construction project management',
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
      id: 'messages', 
      label: 'Messages', 
      icon: <MessageIcon />,
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
      id: 'assistant', 
      label: 'Lumina Operations Assistant', 
      icon: <OperateAssistantIcon size={20} variant="icon" />,
    },
    { 
      id: 'advertise', 
      label: 'Advertise', 
      icon: <AdvertiseIcon />,
    },
  ],
};
