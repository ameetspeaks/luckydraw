# Lucky11 Database Migration Guide

This comprehensive guide walks you through the complete database setup and migration process for the Lucky11 premium mobile application.

## Overview

Lucky11 uses PostgreSQL as its primary database with Drizzle ORM for type-safe database operations. The application includes a sophisticated schema designed to support a premium lucky draw mobile experience with advanced coin economy, earning systems, and comprehensive user management.

## Prerequisites

Before starting the migration process, ensure you have:

- Node.js 20+ installed (recommended for optimal performance)
- PostgreSQL database (local or hosted - Neon, Supabase, AWS RDS, etc.)
- Database connection credentials with full schema permissions
- Replit account for authentication integration
- Understanding of environment variable configuration

## Environment Setup

Create a `.env` file in your project root with the following variables:

```bash
# Database Configuration (Primary)
DATABASE_URL=postgresql://username:password@host:port/database

# Individual Database Components (For granular control)
PGHOST=your_postgresql_host
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_secure_password
PGDATABASE=your_database_name

# Application Security
SESSION_SECRET=your_secure_random_session_secret_minimum_32_characters

# Environment Configuration
NODE_ENV=development
```

## Database Schema Overview

The Lucky11 application uses an advanced database architecture with the following core tables:

### Enhanced Users Table
Comprehensive user management with advanced features:
- **Core Profile**: ID, email, username, display name, avatar
- **Financial Management**: Coin balance with transaction tracking
- **Advanced Statistics**: Participations, wins, earnings, streaks
- **Gamification**: Daily check-ins, streak bonuses, VIP status
- **Social Features**: Public profiles, achievement tracking
- **Security**: Session management, authentication data

### Advanced Draws System
Sophisticated draw management with predetermined winners:
- **Draw Configuration**: Title, description, prize amounts
- **Timing Management**: Scheduled draw times, countdown timers
- **Participant Control**: Limits, current counts, entry fees
- **Winner System**: Predetermined winner selection (not prize pool)
- **Status Tracking**: Active/inactive states, completion status
- **Premium Features**: VIP-only draws, special categories

### Comprehensive Participations Tracking
Complete audit trail of user participation:
- **Entry Management**: User-draw relationships with timestamps
- **Financial Records**: Coin spending per participation
- **Participation History**: Complete user journey tracking
- **Analytics Support**: Data for user behavior analysis

### Advanced Transaction System
Complete financial ecosystem tracking:
- **Earning Transactions**: Daily check-ins, ads, social tasks, achievements
- **Spending Transactions**: Draw participations, purchases
- **Transaction Categories**: Detailed type classification
- **Audit Trail**: Complete financial history with descriptions
- **Balance Management**: Real-time balance calculations

### Winner Management System
Comprehensive winner tracking and celebration:
- **Winner Selection**: Draw-winner relationships
- **Prize Distribution**: Amount tracking and verification
- **Celebration Data**: Content for winner reels
- **Social Features**: Public winner showcases
- **Analytics**: Winner statistics and trends

### Secure Session Management
Enterprise-level session security:
- **PostgreSQL Storage**: Session data stored in database
- **Encryption**: Secure session data handling
- **Automatic Cleanup**: Expired session management
- **Security Features**: CSRF protection, secure cookies

## Enhanced Migration Steps

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm install

# This installs:
# - Drizzle ORM with PostgreSQL support
# - Connection pooling and optimization
# - Authentication and security packages
# - Development and build tools
```

### Step 2: Database Connection Setup

The application uses advanced connection pooling and optimization:

```typescript
// Automatic configuration in server/db.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// WebSocket configuration for serverless environments
neonConfig.webSocketConstructor = ws;

// Connection pool with optimization
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Additional optimizations applied automatically
});

export const db = drizzle({ client: pool, schema });
```

### Step 3: Schema Migration

Create all tables and relationships with a single command:

```bash
npm run db:push
```

This comprehensive migration:
- **Creates Tables**: All core tables with proper relationships
- **Sets Up Indexes**: Optimized indexes for query performance
- **Establishes Constraints**: Foreign keys and data validation
- **Configures Types**: PostgreSQL-specific data types
- **Handles Relationships**: Complete relational integrity
- **Optimizes Performance**: Query optimization and indexing

### Step 4: Database Verification

Verify successful migration:

```sql
-- Connect to PostgreSQL and run:
\dt

-- Expected tables:
-- ✓ users (Enhanced user management)
-- ✓ draws (Advanced draw system)
-- ✓ participations (Complete participation tracking)
-- ✓ transactions (Comprehensive transaction history)
-- ✓ winners (Winner management and celebration)
-- ✓ sessions (Secure session storage)

-- Check table structures:
\d users
\d draws
\d participations
\d transactions
\d winners
```

### Step 5: Comprehensive Data Seeding

Initialize with realistic sample data:

```bash
npm run seed
```

This creates comprehensive test data:
- **User Accounts**: Multiple users with varying profiles and balances
- **Active Draws**: Live draws with different prize amounts and timing
- **Completed Draws**: Historical draws with winner data
- **Participation History**: Realistic user participation patterns
- **Transaction Records**: Complete financial history
- **Winner Celebrations**: Data for testing reels functionality
- **Achievement Data**: Sample achievements and progress tracking

## Detailed Schema Specifications

### Enhanced Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- Unique user identifier
  email TEXT UNIQUE NOT NULL,             -- Authentication email
  username TEXT UNIQUE,                   -- Public username
  display_name TEXT,                      -- Display name for UI
  avatar_url TEXT,                        -- Profile image URL
  coin_balance INTEGER DEFAULT 100,       -- Current coin balance
  total_participations INTEGER DEFAULT 0, -- Lifetime participation count
  total_wins INTEGER DEFAULT 0,           -- Total wins achieved
  total_earnings NUMERIC(10,2) DEFAULT 0, -- Total earnings in currency
  current_streak INTEGER DEFAULT 0,       -- Daily check-in streak
  last_check_in DATE,                     -- Last check-in date
  is_vip BOOLEAN DEFAULT FALSE,           -- VIP status flag
  created_at TIMESTAMP DEFAULT NOW(),     -- Account creation
  updated_at TIMESTAMP DEFAULT NOW()      -- Last profile update
);
```

### Advanced Draws Table
```sql
CREATE TABLE draws (
  id SERIAL PRIMARY KEY,                  -- Auto-incrementing draw ID
  title TEXT NOT NULL,                    -- Draw title/name
  description TEXT,                       -- Detailed description
  prize_amount NUMERIC(10,2) NOT NULL,    -- Prize value in currency
  entry_fee INTEGER NOT NULL,             -- Coin cost to participate
  max_participants INTEGER,               -- Maximum allowed participants
  current_participants INTEGER DEFAULT 0, -- Current participant count
  draw_time TIMESTAMP NOT NULL,           -- Scheduled draw time
  is_active BOOLEAN DEFAULT TRUE,         -- Active status flag
  winner_id TEXT REFERENCES users(id),    -- Selected winner (predetermined)
  prize_image_url TEXT,                   -- Prize image for display
  created_at TIMESTAMP DEFAULT NOW()      -- Draw creation timestamp
);
```

### Complete Participations Tracking
```sql
CREATE TABLE participations (
  id SERIAL PRIMARY KEY,                  -- Unique participation ID
  user_id TEXT NOT NULL REFERENCES users(id), -- Participating user
  draw_id INTEGER NOT NULL REFERENCES draws(id), -- Target draw
  participated_at TIMESTAMP DEFAULT NOW(), -- Participation timestamp
  coins_spent INTEGER NOT NULL,           -- Coins used for entry
  UNIQUE(user_id, draw_id)               -- Prevent duplicate entries
);
```

### Comprehensive Transaction System
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,                  -- Transaction ID
  user_id TEXT NOT NULL REFERENCES users(id), -- Transaction owner
  type TEXT NOT NULL,                     -- Transaction type
  amount INTEGER NOT NULL,                -- Coin amount (positive/negative)
  description TEXT,                       -- Transaction description
  metadata JSONB,                         -- Additional transaction data
  created_at TIMESTAMP DEFAULT NOW()      -- Transaction timestamp
);
```

## Advanced Performance Optimizations

### Strategic Database Indexing
```sql
-- User lookup optimizations
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_vip_status ON users(is_vip);

-- Draw query optimizations
CREATE INDEX idx_draws_active ON draws(is_active);
CREATE INDEX idx_draws_draw_time ON draws(draw_time);
CREATE INDEX idx_draws_active_time ON draws(is_active, draw_time);

-- Participation analytics
CREATE INDEX idx_participations_user ON participations(user_id);
CREATE INDEX idx_participations_draw ON participations(draw_id);
CREATE INDEX idx_participations_time ON participations(participated_at);

-- Transaction history optimization
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_time ON transactions(created_at);

-- Winner showcase optimization
CREATE INDEX idx_winners_draw ON winners(draw_id);
CREATE INDEX idx_winners_time ON winners(created_at);
```

### Query Performance Optimizations
- **Connection Pooling**: Efficient database connection management
- **Prepared Statements**: Pre-compiled queries for better performance
- **Query Planning**: Optimized query execution paths
- **Batch Operations**: Efficient bulk data operations
- **Caching Strategy**: Application-level caching for frequent queries

## Production Migration Checklist

### Pre-Migration Verification
- [ ] Database server specifications meet requirements
- [ ] All environment variables properly configured
- [ ] Database permissions verified (CREATE, ALTER, INSERT, UPDATE, DELETE)
- [ ] Backup strategy implemented
- [ ] Network connectivity and security confirmed

### Migration Execution
- [ ] Run `npm install` successfully
- [ ] Execute `npm run db:push` without errors
- [ ] Verify all tables created correctly
- [ ] Run `npm run seed` for initial data (optional)
- [ ] Test database connections and queries
- [ ] Validate application startup and functionality

### Post-Migration Validation
- [ ] All API endpoints responding correctly
- [ ] User authentication working properly
- [ ] Draw participation functionality operational
- [ ] Transaction recording accurate
- [ ] Performance metrics within acceptable ranges

## Backup and Recovery Strategy

### Automated Backup Setup
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/lucky11"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lucky11_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Clean up old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Recovery Procedures
```bash
# Full database restore
psql $DATABASE_URL < backup_file.sql

# Table-specific restore
pg_restore -d $DATABASE_URL -t users backup_file.dump

# Point-in-time recovery (if using WAL-E or similar)
# Follow your PostgreSQL hosting provider's procedures
```

## Advanced Troubleshooting

### Connection Issues
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check connection pool status
# Monitor active connections in PostgreSQL
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
```

### Performance Diagnostics
```sql
-- Identify slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename IN ('users', 'draws', 'participations', 'transactions');
```

### Data Integrity Checks
```sql
-- Verify referential integrity
SELECT count(*) FROM participations p 
LEFT JOIN users u ON p.user_id = u.id 
WHERE u.id IS NULL;

-- Check balance consistency
SELECT u.id, u.coin_balance, 
       COALESCE(SUM(t.amount), 0) as calculated_balance
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.coin_balance
HAVING u.coin_balance != COALESCE(SUM(t.amount), 0);
```

## Monitoring and Maintenance

### Database Health Monitoring
- **Connection Pool Metrics**: Monitor active/idle connections
- **Query Performance**: Track slow queries and optimization opportunities
- **Storage Usage**: Monitor database size and growth patterns
- **Index Effectiveness**: Analyze index usage and performance impact

### Regular Maintenance Tasks
- **Statistics Updates**: Regular ANALYZE commands for query optimization
- **Index Maintenance**: REINDEX operations for fragmented indexes
- **Vacuum Operations**: Regular VACUUM for space reclamation
- **Log Rotation**: Manage PostgreSQL log files and retention

## Security Considerations

### Database Security
- **Connection Encryption**: SSL/TLS for all database connections
- **Access Control**: Principle of least privilege for database users
- **Regular Updates**: Keep PostgreSQL and dependencies updated
- **Audit Logging**: Enable comprehensive database audit trails

### Application Security
- **SQL Injection Prevention**: Parameterized queries only
- **Session Security**: Secure session storage and management
- **Input Validation**: Comprehensive data validation at all levels
- **Rate Limiting**: API endpoint protection against abuse

## Conclusion

This comprehensive migration guide ensures a robust, scalable, and secure database setup for Lucky11. The advanced schema supports all premium features including the sophisticated coin economy, comprehensive earning systems, and social features that make Lucky11 a standout mobile application.

The database architecture is designed for growth, performance, and reliability while maintaining the flexibility needed for future feature enhancements and scaling requirements.

For additional support, refer to the detailed documentation in README.md and SCHEMA.md files.