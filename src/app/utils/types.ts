export enum Role {
    USER = 'USER',
    SUPER_USER = 'SUPER USER',  
    MANAGER = 'MANAGER',  
    ADMIN = 'ADMIN',
  }

  export type User = {
    id: string
    email: string
    name: string | null
    role: string
    createdAt: Date
    updatedAt: Date
    password?: string
    profilePicture?: string | null
    profileColor?: string | null
    theme: string
  }