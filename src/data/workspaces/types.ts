import { ReactElement, ComponentType } from 'react';

export interface WorkspaceItem {
  id: string;
  label: string;
  icon?: ReactElement;
  component?: ComponentType;
}

export interface WorkspaceConfig {
  id: string;
  name: string;
  description: string;
  icon: ReactElement;
  color: string;
  sidebarItems: WorkspaceItem[];
  defaultTab: string;
}
