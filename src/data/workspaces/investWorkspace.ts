import {
  Group as CrowdfundingIcon,
  Handshake as JointVentureIcon,
  PieChart as FractionalIcon,
  Business as PrivateMarketIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../../theme";


export const investWorkspace: WorkspaceConfig = {
  id: 'invest',
  name: 'Invest',
  description: 'Investment opportunities and portfolio management',
  icon: <CrowdfundingIcon />,
  color: brandColors.primary,
  defaultTab: 'crowdfunding',
  sidebarItems: [
    { 
      id: 'crowdfunding', 
      label: 'Crowdfunded Deals', 
      icon: <CrowdfundingIcon />,
    },
    { 
      id: 'jointventure', 
      label: 'Joint Venture', 
      icon: <JointVentureIcon />,
    },
    { 
      id: 'fractional', 
      label: 'Fractional Ownership', 
      icon: <FractionalIcon />,
    },
    { 
      id: 'privatemarket', 
      label: 'Private Market Investment Listings', 
      icon: <PrivateMarketIcon />,
    },
  ],
};
