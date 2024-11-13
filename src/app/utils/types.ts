export enum Permission {
  // User Management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Role Management
  MANAGE_ROLES = 'manage_roles',
  
  // Content Management
  CREATE_CONTENT = 'create_content',
  READ_CONTENT = 'read_content',
  UPDATE_CONTENT = 'update_content',
  DELETE_CONTENT = 'delete_content',
  
  // System Management
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_SETTINGS = 'manage_settings'
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  profilePicture?: string | null;
  profileColor?: string | null;
}