# Lucky11 Database Schema Documentation

## Overview
This document outlines the complete database schema for the Lucky11 mobile application, including all tables, relationships, and data flow patterns.

## Database Tables

### 1. Users Table
**Purpose**: Stores user account information and statistics
```sql
users (
  id TEXT PRIMARY KEY,           -- Replit user ID
  email TEXT NOT NULL,           -- User email address
  firstName TEXT,                -- User's first name
  lastName TEXT,                 -- User's last name  
  profileImageUrl TEXT,          -- Profile picture URL
  coins INTEGER DEFAULT 0,       -- Current coin balance
  totalParticipations INTEGER DEFAULT 0,  -- Total draws participated
  totalWins INTEGER DEFAULT 0,             -- Total draws won
  totalEarnings NUMERIC(10,2) DEFAULT 0,  -- Total prize money earned
  currentStreak INTEGER DEFAULT 0,        -- Current daily check-in streak
  isVip BOOLEAN DEFAULT FALSE,            -- VIP membership status
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

### 2. Draws Table
**Purpose**: Stores draw/lottery information
```sql
draws (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,           -- Draw title
  description TEXT,              -- Draw description
  prizeAmount NUMERIC(10,2) NOT NULL,    -- Prize value
  entryFee INTEGER NOT NULL,     -- Cost in coins to participate
  maxParticipants INTEGER,       -- Maximum allowed participants
  currentParticipants INTEGER DEFAULT 0, -- Current participant count
  drawTime TIMESTAMP NOT NULL,   -- When draw will be conducted
  prizeImageUrl TEXT,           -- Prize image URL
  isActive BOOLEAN DEFAULT TRUE, -- Whether draw is active
  winnerId TEXT,                -- Winner user ID (after draw)
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

### 3. Participations Table
**Purpose**: Tracks user participation in draws
```sql
participations (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  drawId INTEGER NOT NULL REFERENCES draws(id),
  participatedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, drawId)  -- Prevent duplicate participation
)
```

### 4. Transactions Table
**Purpose**: Records all coin transactions
```sql
transactions (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,      -- 'purchase', 'participation', 'daily_bonus', 'prize_win'
  amount INTEGER NOT NULL, -- Coin amount (positive for credit, negative for debit)
  description TEXT,        -- Transaction description
  createdAt TIMESTAMP DEFAULT NOW()
)
```

### 5. Winners Table
**Purpose**: Stores draw winner information
```sql
winners (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES users(id),
  drawId INTEGER NOT NULL REFERENCES draws(id),
  prizeAmount NUMERIC(10,2) NOT NULL,
  wonAt TIMESTAMP DEFAULT NOW(),
  celebrationVideoUrl TEXT,  -- Winner celebration video
  isPublic BOOLEAN DEFAULT TRUE  -- Whether to show in public reels
)
```

### 6. Sessions Table
**Purpose**: Manages user session data (created by connect-pg-simple)
```sql
sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
)
```

## Database Relations

### One-to-Many Relationships
- `users` → `participations` (One user can have many participations)
- `users` → `transactions` (One user can have many transactions)  
- `users` → `winners` (One user can win multiple draws)
- `draws` → `participations` (One draw can have many participants)
- `draws` → `winners` (One draw can have multiple winners - future feature)

### Many-to-Many Relationships
- `users` ↔ `draws` (through `participations` table)

## Indexes and Constraints

### Primary Keys
- All tables have appropriate primary keys (id columns)

### Foreign Keys
- `participations.userId` → `users.id`
- `participations.drawId` → `draws.id`
- `transactions.userId` → `users.id`
- `winners.userId` → `users.id`
- `winners.drawId` → `draws.id`

### Unique Constraints
- `participations(userId, drawId)` - Prevents duplicate participation
- `users.email` - Ensures unique email addresses

### Recommended Indexes
```sql
CREATE INDEX idx_draws_active_drawtime ON draws(isActive, drawTime);
CREATE INDEX idx_participations_userid ON participations(userId);
CREATE INDEX idx_participations_drawid ON participations(drawId);
CREATE INDEX idx_transactions_userid_created ON transactions(userId, createdAt);
CREATE INDEX idx_winners_userid ON winners(userId);
```

## Data Flow Patterns

### 1. User Registration Flow
1. User authenticates via Replit Auth
2. User record created/updated in `users` table
3. Initial coin bonus added via `transactions` table

### 2. Draw Participation Flow
1. User selects active draw from `draws` table
2. System checks user coin balance in `users` table
3. Participation recorded in `participations` table
4. Coins deducted and recorded in `transactions` table
5. `draws.currentParticipants` incremented

### 3. Winner Selection Flow
1. System selects random winner from `participations` table
2. Winner recorded in `winners` table
3. `draws.winnerId` updated
4. Prize amount added to winner's balance via `transactions` table
5. Winner statistics updated in `users` table

### 4. Coin Purchase Flow
1. User initiates coin purchase
2. Payment processed (external system)
3. Coins credited to `users.coins`
4. Transaction recorded in `transactions` table

## Migration Strategy

### Current Migration Status
- All tables created via Drizzle schema
- Foreign key relationships established
- Default values and constraints applied

### Future Migrations
- Add indexes for performance optimization
- Add additional fields as features expand
- Implement soft deletes if needed
- Add audit trails for sensitive operations

## Security Considerations

### Data Protection
- User IDs from Replit Auth (no sensitive auth data stored)
- Email addresses stored securely
- Transaction amounts use NUMERIC for precision
- Session data managed by connect-pg-simple

### Access Control
- All database operations go through Drizzle ORM
- Query parameterization prevents SQL injection
- User-specific data filtered by authenticated user ID

## Performance Optimization

### Current Optimizations
- Efficient foreign key relationships
- Appropriate data types (INTEGER for coins, NUMERIC for money)
- Default values reduce query complexity

### Recommended Optimizations
- Add database indexes on frequently queried columns
- Consider read replicas for analytics queries
- Implement connection pooling for high traffic
- Use database triggers for automatic timestamp updates

## Backup and Recovery

### Backup Strategy
- Regular PostgreSQL backups via Replit infrastructure
- Point-in-time recovery capability
- Schema version control via Drizzle migrations

### Recovery Procedures
- Database restoration from backups
- Schema migration rollback procedures
- Data integrity verification processes