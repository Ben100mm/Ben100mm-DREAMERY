import {
  Dashboard as DashboardIcon,
  Assignment as ProjectsIcon,
  Add as CreateProjectIcon,
  PersonAdd as InvestorIcon,
  Security as ComplianceIcon,
  Calculate as CalculatorIcon,
  AccountBox as PortalIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../../theme";


export const fundWorkspace: WorkspaceConfig = {
  id: 'fund',
  name: 'Fund',
  description: 'Capital raising and fundraising platform',
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
      label: 'Create New Project', 
      icon: <CreateProjectIcon />,
    },
    { 
      id: 'investor', 
      label: 'Investor Onboarding', 
      icon: <InvestorIcon />,
    },
    { 
      id: 'compliance', 
      label: 'Capital Raise Compliance Tools', 
      icon: <ComplianceIcon />,
    },
    { 
      id: 'calculator', 
      label: 'Waterfall & ROI Calculators', 
      icon: <CalculatorIcon />,
    },
    { 
      id: 'portal', 
      label: 'Secure Investor Portal', 
      icon: <PortalIcon />,
    },
  ],
};
