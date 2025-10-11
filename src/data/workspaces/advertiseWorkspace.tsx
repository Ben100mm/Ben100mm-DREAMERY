import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Campaign as CampaignIcon,
  Campaign as AdsIcon,
  LocalOffer as PromotionsIcon,
  Create as CreateIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const advertiseWorkspace: WorkspaceConfig = {
  id: 'advertise',
  name: 'Advertise',
  description: 'Marketing tools and advertising platform',
  icon: <CampaignIcon />,
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
      id: 'ads', 
      label: 'Ads', 
      icon: <AdsIcon />,
    },
    { 
      id: 'promotions', 
      label: 'Promotions', 
      icon: <PromotionsIcon />,
    },
    { 
      id: 'create', 
      label: 'Create', 
      icon: <CreateIcon />,
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: <AnalyticsIcon />,
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <SettingsIcon />,
    },
  ],
};

