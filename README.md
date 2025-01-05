# Next.js Authentication Showcase

A modern authentication and authorization system built with Next.js 15, featuring comprehensive session management, role-based access control (RBAC), and user profile management.

**Currently is has some issues with seed.ts and logging in**

## Key Features

- 🔐 **Secure Authentication**
  - Session-based authentication using JWT tokens
  - HTTP-only cookies for secure session storage
  - Password hashing with bcrypt
  - Protection against CSRF attacks

- 👥 **Advanced Role-Based Access Control**
  - Granular permission system
  - Hierarchical roles (User, Manager, Admin)
  - Dynamic role creation and management
  - Permission-based route protection

- 📊 **User Management**
  - User profile management
  - Dynamic avatar generation with color gradients
  - Role assignment and modification
  - User activity tracking

- 📝 **Audit Logging**
  - Comprehensive activity logging
  - IP address and user agent tracking
  - Security event monitoring
  - Audit trail for compliance

- 🛡️ **Security Features**
  - Protected API routes
  - Middleware-based route protection
  - Input validation with Zod
  - Type-safe database operations

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: Prisma with SQLite
- **Styling**: Tailwind CSS
- **Authentication**: JWT (jose)
- **Security**: bcrypt, HTTP-only cookies
- **Validation**: Zod

