# Overview

This is a modern full-stack pharmacy e-commerce application built with React, Express.js, and PostgreSQL. The application represents "Yashlok Medical Hall," a pharmacy that has been serving customers since 1982. It provides a complete online medicine ordering system with features like product browsing by categories, medicine details with reviews, shopping cart functionality, and a responsive design using shadcn/ui components.

The application follows a monorepo structure with a client-server architecture, where the frontend (React) and backend (Express.js) are organized in separate directories but share common schemas and types through a shared directory.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript and follows a modern component-based architecture:
- **UI Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for cart management, TanStack Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library following the "New York" style
- **Component Structure**: Organized into pages, components, and UI components with clear separation of concerns

The application uses a custom theme system with CSS variables for consistent styling and supports responsive design patterns.

## Backend Architecture
The server follows a RESTful API design pattern:
- **Framework**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM for type-safe database operations
- **API Structure**: Organized route handlers in a separate routes file
- **Storage Pattern**: Abstracted storage interface allowing for different implementations (currently in-memory for development)
- **Session Management**: Session-based cart management for anonymous users

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Connection**: Uses Neon serverless PostgreSQL for cloud deployment
- **Schema Design**: Normalized relational database with tables for users, categories, medicines, reviews, and cart items
- **Type Safety**: Drizzle-zod integration for runtime validation and type inference

The database schema includes:
- Users table for customer management
- Categories for medicine organization
- Medicines with detailed product information
- Reviews system for customer feedback
- Cart items for session-based shopping

## Authentication and Authorization
Currently implements session-based authentication:
- **Session Management**: Uses session IDs stored in localStorage for cart persistence
- **User Management**: Basic user schema prepared for future authentication implementation
- **Cart Security**: Session-based cart isolation ensures user data privacy

## Build and Development
- **Development**: Vite dev server with hot reload and TypeScript checking
- **Production**: Optimized builds with code splitting and static asset handling
- **Deployment**: Configured for Node.js production environments with proper error handling

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting service
- **Drizzle Kit**: Database migration and schema management tool

## UI and Styling
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind

## Development Tools
- **TypeScript**: Static typing for both client and server
- **Vite**: Fast build tool with HMR for development
- **PostCSS**: CSS processing with Tailwind CSS integration
- **ESBuild**: Fast JavaScript bundler for production builds

## Runtime Dependencies
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe CSS class composition
- **Wouter**: Lightweight routing library for React

The application is designed to be easily deployable on platforms like Replit with minimal configuration required.