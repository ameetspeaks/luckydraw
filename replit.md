# Lucky Draw App - Replit.md

## Overview

This is a premium lucky draw mobile application built with a modern tech stack featuring a React frontend and Express backend. The app implements a coin-based economy where users purchase coins to participate in draws, with AI-powered random winner selection. The application is designed with CRED-inspired premium aesthetics and focuses on mobile-first user experience.

## System Architecture

The application follows a full-stack architecture with clear separation between frontend and backend:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite build tool
- **Routing**: Client-side routing with Wouter
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with dark theme and custom gradient designs
- **Mobile-First**: Responsive design optimized for mobile devices

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration with session management
- **API Design**: RESTful API endpoints for all core functionality

## Key Components

### User Management
- Replit Auth integration for seamless authentication
- User profiles with coin balance tracking
- Statistics tracking (participations, wins, earnings, streaks)
- VIP status system

### Coin Economy System
- Virtual coin-based payment system
- Multiple coin purchase packages with bonus incentives
- Transaction history tracking
- Automatic coin deduction for draw participation

### Draw Management
- Admin-configurable draws with prize pools
- Real-time participant tracking
- Countdown timers for draw deadlines
- AI-powered random winner selection

### Winner Selection & Rewards
- Transparent AI-based selection algorithm
- Winner announcement system
- Prize distribution tracking
- Winner showcase features

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or retrieving user profiles
2. **Coin Management**: Users purchase coins through payment integration, coins are credited to their account
3. **Draw Participation**: Users spend coins to enter draws, creating participation records
4. **Winner Selection**: At scheduled times, AI randomly selects winners from participants
5. **Prize Distribution**: Winners are notified and prizes are distributed

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Data fetching and caching
- **@radix-ui/***: Accessible UI component primitives
- **express**: Backend web framework
- **passport**: Authentication middleware

### UI & Styling
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **clsx**: Conditional class name utility

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Type safety
- **drizzle-kit**: Database migration tool

## Deployment Strategy

The application is configured for deployment on Replit with:

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Single production command serves both frontend and backend

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Session management with PostgreSQL store
- Replit-specific authentication configuration

### Development vs Production
- Development: Vite dev server with HMR
- Production: Express serves static files and API routes

## Changelog

- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.