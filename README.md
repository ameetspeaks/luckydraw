# Lucky11 - Premium Lucky Draw Mobile App

A sophisticated mobile application built with React and Express that brings the excitement of lucky draws to your fingertips. Lucky11 features a comprehensive coin-based economy, real-time draws, multiple earning opportunities, and an immersive winner celebration experience.

## 🎯 Key Features

### Core Functionality
- **Advanced Coin Economy**: Multiple ways to earn and spend virtual coins
- **Real-Time Lucky Draws**: Join live draws with countdown timers and predetermined winners
- **Winner Celebrations**: TikTok-style video reels showcasing winner celebrations
- **Comprehensive Earning System**: 8+ methods to earn coins including daily check-ins, ads, social tasks
- **User Profiles**: Track participation history, wins, streaks, and detailed statistics

### Premium Experience
- **CRED-Inspired Design**: Dark theme with gradient accents and premium aesthetics
- **Mobile-First**: Optimized responsive design for all mobile devices
- **Smooth Animations**: Fluid transitions and micro-interactions throughout
- **Real-Time Updates**: Live participant counts and draw status updates
- **Tabbed Navigation**: Live/Past/My Draws organization with pagination

### Enhanced Features
- **Daily Check-in System**: Streak bonuses up to 100 coins
- **Advertisement Rewards**: Watch video ads for instant 10-coin rewards
- **Social Task System**: Share app, invite friends, rate app for 50-100 coins
- **Achievement Unlocks**: Milestone-based rewards up to 300 coins
- **Predetermined Winners**: Each draw has one guaranteed winner (no prize pool splitting)
- **Comprehensive Transaction History**: Track all coin earnings and spendings

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- PostgreSQL database
- Replit account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lucky11
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database
DATABASE_URL=your_postgresql_connection_string
PGHOST=your_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database

# Session
SESSION_SECRET=your_session_secret_here
```

4. Initialize the database:
```bash
npm run db:push
```

5. Seed sample data (optional):
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and animations

### Backend (Express + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth integration with session management
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with comprehensive validation

### Database Schema
- **Users**: Profile data, coin balances, statistics, streaks, VIP status
- **Draws**: Draw configuration, prizes, timing, participant limits
- **Participations**: User entries in draws with timestamps
- **Transactions**: Complete coin earning/spending history
- **Winners**: Draw results and prize distribution records
- **Sessions**: Secure session storage in PostgreSQL

## 📱 Pages & Features

### Enhanced Home Page
- CRED-inspired premium dashboard design
- Quick stats and coin balance display
- Recent draw highlights with beautiful cards
- Navigation to main features
- Premium gradient backgrounds

### Advanced Draws System
- **Live Draws**: Active draws with real-time countdown timers
- **Past Draws**: Completed draws with winner status and results
- **My Draws**: User's complete participation history
- **Pagination**: 5 draws per page for optimal performance
- **Real-time Updates**: Live participant counting and status updates
- **Smart Filtering**: Intelligent categorization of draws

### Comprehensive Earning System
- **Daily Check-in**: Streak-based rewards (10-100 coins)
- **Watch Advertisements**: 10 coins per video ad
- **Social Tasks**:
  - Share App: 50 coins
  - Invite Friends: 100 coins
  - Rate App: 75 coins
- **Achievement System**:
  - First Win: 100 coins
  - 10 Participations: 150 coins
  - 5-Day Streak: 200 coins
  - Lucky Winner: 300 coins
- **Task Cooldowns**: Prevents abuse with smart timing
- **Progress Tracking**: Visual progress bars and completion status

### Winner Reels
- **TikTok-Style Interface**: Vertical scrolling video experience
- **Winner Celebrations**: Real winner data with celebration videos
- **Interactive Elements**: Like, comment, and share functionality
- **Infinite Scroll**: Smooth animations and loading
- **Premium Visual Effects**: Gradient overlays and premium styling

### Enhanced Wallet
- **Detailed Coin Balance**: Real-time balance updates
- **Purchase Packages**: Multiple coin packages with bonuses
- **Complete Transaction History**: All earnings and spendings
- **Payment Integration**: Ready for payment gateway integration
- **Visual Transaction Types**: Icons and categories for all transactions

### Detailed Profile
- **Comprehensive Statistics**: Wins, participations, earnings, streaks
- **Achievement Gallery**: Unlocked achievements and progress
- **Participation History**: Complete draw history with results
- **Settings**: User preferences and account management

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run db:push` - Push database schema changes to PostgreSQL
- `npm run seed` - Seed database with comprehensive sample data

### Enhanced Project Structure
```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn/ui components
│   │   │   ├── draw-card.tsx
│   │   │   ├── coin-balance.tsx
│   │   │   ├── countdown-timer.tsx
│   │   │   └── winner-modal.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── home.tsx   # CRED-inspired homepage
│   │   │   ├── draws-enhanced.tsx # Advanced draws with tabs
│   │   │   ├── earn.tsx   # Comprehensive earning system
│   │   │   ├── reels.tsx  # TikTok-style winner reels
│   │   │   └── wallet.tsx # Enhanced wallet features
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── routes.ts          # Enhanced API routes
│   ├── storage.ts         # Database operations with Drizzle
│   ├── auth.ts           # Replit Auth integration
│   └── db.ts             # Database connection setup
├── shared/                # Shared TypeScript types
│   └── schema.ts         # Complete database schema
├── scripts/              # Database and utility scripts
│   └── seed-data.ts      # Comprehensive data seeding
└── docs/                 # Documentation
    ├── SCHEMA.md         # Database schema documentation
    └── MIGRATION.md      # Migration and setup guide
```

## 🎨 Enhanced Design System

### Premium Color Palette
- **Primary Gradients**: Blue (#3B82F6 → #1D4ED8)
- **Secondary Gradients**: Purple (#8B5CF6 → #7C3AED)  
- **Accent Colors**: Gold/Yellow (#F59E0B → #D97706)
- **Success**: Green (#10B981 → #059669)
- **Warning**: Orange (#F97316 → #EA580C)
- **Error**: Red (#EF4444 → #DC2626)
- **Background**: Dark gradients with glass morphism
- **Text**: White primary, gray variations for hierarchy

### Typography System
- **Display**: Bold gradient text with effects
- **Headings**: Clean hierarchy with proper spacing
- **Body**: Readable sans-serif optimized for mobile
- **UI Elements**: Compact, efficient text styling
- **Numbers**: Tabular figures for coin amounts

### Advanced Component System
- **Glass Cards**: Backdrop blur with subtle borders
- **Gradient Buttons**: Multi-state hover and active effects
- **Premium Badges**: Status indicators with animations
- **Progress Bars**: Animated progress with smooth transitions
- **Modal Overlays**: Full-screen immersive experiences

## 🔐 Security & Data Protection

- **Replit Auth**: Secure OAuth 2.0 integration
- **Session Security**: Server-side sessions with PostgreSQL storage
- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **Rate Limiting**: API endpoint protection
- **Data Sanitization**: User input cleaning and validation

## 📊 Performance Optimizations

- **Code Splitting**: Route-based and component-level splitting
- **Lazy Loading**: Dynamic imports for better initial load
- **Query Optimization**: TanStack Query with intelligent caching
- **Database Indexing**: Optimized queries with proper indexes
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Optimized builds with tree shaking

## 🚀 Deployment Guide

### Production Build Process
```bash
# Install dependencies
npm install

# Build optimized bundle
npm run build

# Database setup
npm run db:push

# Optional: Seed data
npm run seed
```

### Environment Configuration
Required environment variables:
```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database
PGHOST=your_postgresql_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=your_database_name

# Application Configuration
NODE_ENV=production
SESSION_SECRET=your_secure_session_secret
```

### Replit Deployment Features
- **Automatic Builds**: Configured build process
- **Environment Management**: Secure secret handling
- **Database Integration**: PostgreSQL connection
- **Auth Integration**: Replit Auth setup
- **Static Serving**: Optimized asset delivery

## 🤝 Contributing Guidelines

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Follow** coding standards and TypeScript best practices
4. **Test** thoroughly on mobile devices
5. **Commit** with descriptive messages: `git commit -m 'Add: amazing feature'`
6. **Push** to branch: `git push origin feature/amazing-feature`
7. **Open** Pull Request with detailed description

### Development Standards
- TypeScript strict mode compliance
- Mobile-first responsive design
- Accessibility standards (WCAG 2.1)
- Performance optimization
- Comprehensive error handling

## 📄 License

Licensed under the MIT License. See [LICENSE](LICENSE) for complete details.

## 🙏 Acknowledgments & Credits

- **Replit**: Platform, authentication, and hosting services
- **Shadcn/ui**: Beautiful, accessible UI component library
- **Radix UI**: Primitive components with accessibility focus
- **Lucide React**: Clean, consistent icon library
- **TanStack Query**: Powerful server state management
- **Drizzle ORM**: Type-safe database operations
- **Tailwind CSS**: Utility-first styling framework

---

**🎲 Built with passion for the thrill of winning and premium mobile experiences**