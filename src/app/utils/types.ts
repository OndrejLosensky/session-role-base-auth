export enum Permission {
  // Content management 
  READ_CONTENT = 'read_content',

  // User Management
  CREATE_USER = 'create_user',  
  DELETE_USER = 'delete_user',
  VIEW_PROFILE = 'view_profile',
  
  // System Management
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_SETTINGS = 'manage_settings'
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: { name: string }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  profilePicture: string | null;
  profileColor: string | null;
}