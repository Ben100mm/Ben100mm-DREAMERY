import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  School as CoursesIcon,
  Assignment as CaseStudiesIcon,
  QuestionAnswer as QAIcon,
  VideoCall as LiveSessionsIcon,
  Psychology as AITutorIcon,
} from '@mui/icons-material';

import { WorkspaceItem, WorkspaceConfig } from './types';
import { brandColors } from "../../theme";


export const learnWorkspace: WorkspaceConfig = {
  id: 'learn',
  name: 'Learn',
  description: 'Real estate education and learning platform',
  icon: <SchoolIcon />,
  color: brandColors.primary,
  defaultTab: 'dashboard',
  sidebarItems: [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <DashboardIcon />,
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      icon: <CoursesIcon />,
    },
    { 
      id: 'casestudies', 
      label: 'Case Studies', 
      icon: <CaseStudiesIcon />,
    },
    { 
      id: 'qa', 
      label: 'Q&A', 
      icon: <QAIcon />,
    },
    { 
      id: 'livesessions', 
      label: 'Live Sessions', 
      icon: <LiveSessionsIcon />,
    },
    { 
      id: 'aitutor', 
      label: 'Lumina', 
      icon: <AITutorIcon />,
    },
  ],
};

