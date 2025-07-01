# Lucky11 Database Migration Guide

## Overview
This document provides comprehensive migration procedures for the Lucky11 database schema, including setup instructions, rollback procedures, and data management strategies.

## Initial Database Setup

### Prerequisites
- PostgreSQL database provisioned
- Drizzle ORM configured
- Environment variables set:
  - `DATABASE_URL`
  - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

### Schema Creation Command
```bash
npm run db:push
```

This command will:
1. Connect to PostgreSQL database
2. Create all required tables with proper constraints
3. Establish foreign key relationships
4. Apply default values and indexes

## Migration History

### Version 1.0.0 - Initial Schema (July 01, 2025)
**Created Tables:**
- `sessions` - User session management
- `users` - User profiles and statistics
- `draws` - Draw/lottery information
- `participations` - User draw participation records
- `transactions` - Coin transaction history
- `winners` - Draw winner records

**Key Features:**
- User authentication integration with Replit Auth
- Coin-based economy system
- Draw participation tracking
- Winner selection and prize distribution
- Transaction audit trail

## Current Schema State

### Table Structure Overview
```sql
-- Users table with statistics
users: id(TEXT), email(TEXT), firstName(TEXT), lastName(TEXT), 
       profileImageUrl(TEXT), coins(INTEGER), totalParticipations(INTEGER),
       totalWins(INTEGER), totalEarnings(NUMERIC), currentStreak(INTEGER),
       isVip(BOOLEAN), createdAt(TIMESTAMP), updatedAt(TIMESTAMP)

-- Draws with participation tracking
draws: id(SERIAL), title(TEXT), description(TEXT), prizeAmount(NUMERIC),
       entryFee(INTEGER), maxParticipants(INTEGER), currentParticipants(INTEGER),
       drawTime(TIMESTAMP), prizeImageUrl(TEXT), isActive(BOOLEAN),
       winnerId(TEXT), createdAt(TIMESTAMP), updatedAt(TIMESTAMP)

-- User participation records
participations: id(SERIAL), userId(TEXT), drawId(INTEGER), 
                participatedAt(TIMESTAMP)

-- Financial transaction tracking
transactions: id(SERIAL), userId(TEXT), type(TEXT), amount(INTEGER),
              description(TEXT), createdAt(TIMESTAMP)

-- Winner records
winners: id(SERIAL), userId(TEXT), drawId(INTEGER), prizeAmount(NUMERIC),
         wonAt(TIMESTAMP), celebrationVideoUrl(TEXT), isPublic(BOOLEAN)

-- Session management (auto-created by connect-pg-simple)
sessions: sid(VARCHAR), sess(JSON), expire(TIMESTAMP)
```

## Data Migration Procedures

### 1. Fresh Installation
```bash
# Create new database
npm run db:push

# Seed initial data (optional)
npm run seed
```

### 2. Schema Updates
When schema changes are made in `shared/schema.ts`:

```bash
# Review changes
npm run db:generate

# Apply changes
npm run db:push
```

### 3. Data Import/Export

#### Export Data
```bash
# Export all tables
pg_dump $DATABASE_URL > backup.sql

# Export specific table
pg_dump $DATABASE_URL -t users > users_backup.sql
```

#### Import Data
```bash
# Import from backup
psql $DATABASE_URL < backup.sql

# Import specific table
psql $DATABASE_URL < users_backup.sql
```

### 4. Development vs Production

#### Development Environment
- Use `npm run db:push` for rapid prototyping
- Reset database when needed: `npm run db:reset` (if implemented)
- Seed test data: `npm run seed`

#### Production Environment
- Always backup before migrations
- Use versioned migration files
- Test migrations on staging environment first
- Monitor performance after schema changes

## Rollback Procedures

### 1. Schema Rollback
If a migration causes issues:

```bash
# Restore from backup
psql $DATABASE_URL < pre_migration_backup.sql

# Or manually revert schema changes
# Edit shared/schema.ts to previous version
npm run db:push
```

### 2. Data Recovery
```bash
# Point-in-time recovery (if supported by provider)
# Contact database provider for specific procedures

# Manual data recovery from backup
psql $DATABASE_URL -c "DELETE FROM table_name WHERE condition;"
psql $DATABASE_URL < table_backup.sql
```

## Performance Optimization Migrations

### Recommended Indexes
```sql
-- Create performance indexes
CREATE INDEX CONCURRENTLY idx_draws_active_drawtime 
ON draws(isActive, drawTime) WHERE isActive = true;

CREATE INDEX CONCURRENTLY idx_participations_userid 
ON participations(userId);

CREATE INDEX CONCURRENTLY idx_participations_drawid 
ON participations(drawId);

CREATE INDEX CONCURRENTLY idx_transactions_userid_created 
ON transactions(userId, createdAt DESC);

CREATE INDEX CONCURRENTLY idx_winners_userid 
ON winners(userId);

CREATE INDEX CONCURRENTLY idx_winners_public_recent 
ON winners(isPublic, wonAt DESC) WHERE isPublic = true;
```

### Query Optimization
```sql
-- Analyze table statistics
ANALYZE users;
ANALYZE draws;
ANALYZE participations;
ANALYZE transactions;
ANALYZE winners;
```

## Data Integrity Checks

### Verification Queries
```sql
-- Check foreign key integrity
SELECT COUNT(*) FROM participations p 
LEFT JOIN users u ON p.userId = u.id 
WHERE u.id IS NULL;

SELECT COUNT(*) FROM participations p 
LEFT JOIN draws d ON p.drawId = d.id 
WHERE d.id IS NULL;

-- Verify coin balance consistency
SELECT u.id, u.coins, 
       COALESCE(SUM(t.amount), 0) as calculated_balance
FROM users u
LEFT JOIN transactions t ON u.id = t.userId
GROUP BY u.id, u.coins
HAVING u.coins != COALESCE(SUM(t.amount), 0);

-- Check draw participant counts
SELECT d.id, d.currentParticipants, 
       COUNT(p.id) as actual_participants
FROM draws d
LEFT JOIN participations p ON d.id = p.drawId
GROUP BY d.id, d.currentParticipants
HAVING d.currentParticipants != COUNT(p.id);
```

## Security Considerations

### Migration Security
- Always use connection strings with SSL in production
- Limit database user permissions during migrations
- Audit all migration scripts before execution
- Use parameterized queries in custom migration scripts

### Data Protection
- Encrypt sensitive data columns if required
- Implement row-level security for multi-tenant scenarios
- Regular security audits of schema and permissions

## Troubleshooting

### Common Issues

#### 1. Connection Errors
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Verify environment variables
echo $DATABASE_URL
```

#### 2. Schema Conflicts
```bash
# Check current schema state
npm run db:introspect

# Compare with expected schema
# Review shared/schema.ts
```

#### 3. Performance Issues
```bash
# Check table statistics
psql $DATABASE_URL -c "\dt+"

# Analyze slow queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
```

### Emergency Procedures

#### 1. Database Corruption
1. Stop application immediately
2. Create emergency backup if possible
3. Contact database provider support
4. Prepare rollback to last known good state

#### 2. Data Loss Prevention
1. Implement regular automated backups
2. Test backup restoration procedures
3. Monitor critical data integrity checks
4. Maintain off-site backup copies

## Future Migration Planning

### Planned Schema Enhancements
1. **Version 1.1.0**: Add user preferences and settings
2. **Version 1.2.0**: Implement social features (friends, sharing)
3. **Version 1.3.0**: Add draw categories and filtering
4. **Version 1.4.0**: Implement premium features and subscriptions

### Scalability Considerations
- Partition large tables by date or user segments
- Implement read replicas for reporting queries
- Consider horizontal sharding for high-volume scenarios
- Plan for archive/purge strategies for historical data

## Monitoring and Maintenance

### Regular Maintenance Tasks
- Weekly: Check database performance metrics
- Monthly: Review and optimize slow queries
- Quarterly: Analyze table growth and plan capacity
- Annually: Review and update backup/recovery procedures

### Monitoring Alerts
- Database connection failures
- Long-running queries (>5 seconds)
- High disk usage (>80%)
- Failed backup operations
- Foreign key constraint violations