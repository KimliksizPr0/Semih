# Semih Topak Portal - Project Archive Platform

## Overview

This is a React-based web application with an Express backend that presents itself as a professional "project archive" platform. The system is designed to appear as a legitimate productivity tool collection while providing a hidden admin panel for content management. It features a modern dark theme with animations, responsive design, and a stealth administrative interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **Styling**: Tailwind CSS with custom dark theme
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Animations**: Framer Motion for smooth transitions and effects
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Connect-pg-simple for PostgreSQL-based sessions
- **API Design**: RESTful endpoints for CRUD operations
- **Development**: tsx for TypeScript execution in development

## Key Components

### Authentication & Security
- **Admin Access**: Hidden admin panel accessible via keyboard shortcut (Ctrl+Alt+S) or mobile tap sequence
- **Password Protection**: Single password authentication for admin panel ("admin123")
- **Session Management**: PostgreSQL-based session storage for scalability

### Database Schema
- **Users Table**: Basic user management with username/password
- **Projects Table**: Core content storage with metadata (name, description, category, icon, link, offline status)
- **Schema Validation**: Zod integration with Drizzle for type-safe database operations

### UI/UX Features
- **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
- **Dark Theme**: Professional dark color scheme with green accents
- **Loading States**: Animated loading screen on initial app load
- **Particle Background**: Subtle animated background effects
- **Search & Filtering**: Real-time search with category and status filters
- **Favorites System**: Client-side localStorage-based favorites management

### Project Management
- **Categories**: Productivity, Design, Development, Tools
- **Status Types**: Online/Offline project classification
- **CRUD Operations**: Full create, read, update, delete functionality
- **Data Export**: JSON export functionality for backup purposes

## Data Flow

1. **Client Request**: User interacts with React frontend
2. **Query Management**: TanStack Query manages API requests and caching
3. **API Layer**: Express routes handle HTTP requests
4. **Database Operations**: Drizzle ORM executes PostgreSQL queries
5. **Response Processing**: Data flows back through the same chain
6. **UI Updates**: React components re-render with new data

### Admin Panel Flow
1. **Access Trigger**: Keyboard shortcut or mobile tap sequence
2. **Password Modal**: Authentication challenge
3. **Admin Panel**: CRUD interface for project management
4. **Real-time Updates**: Changes immediately reflect in the main interface

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **wouter**: Lightweight React router
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Tailwind variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type safety
- **tsx**: TypeScript execution
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with nodemon-like functionality
- **Database**: Neon serverless PostgreSQL
- **Environment**: NODE_ENV=development

### Production Build
- **Frontend**: Vite build to dist/public
- **Backend**: esbuild bundle to dist/index.js
- **Database**: Production Neon PostgreSQL instance
- **Deployment**: Node.js server serving both frontend and API

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **REPL_ID**: Replit environment detection

### Build Commands
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build (frontend + backend)
- `npm run start`: Production server
- `npm run db:push`: Database schema deployment

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```