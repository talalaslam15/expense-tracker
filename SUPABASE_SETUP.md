# Supabase Integration Setup

## Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Database Schema

Make sure you have created the following tables in your Supabase database:

### 1. expenses table

```sql
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  type TEXT CHECK (type IN ('expense', 'income')) NOT NULL DEFAULT 'expense',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. user_preferences table

```sql
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  currency_code TEXT NOT NULL DEFAULT 'USD',
  currency_symbol TEXT NOT NULL DEFAULT '$',
  currency_has_decimals BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Indexes

```sql
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category);
CREATE INDEX idx_expenses_user_type ON expenses(user_id, type);
```

### 4. Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Expenses policies
CREATE POLICY "Users can manage their own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);
```

## Features Implemented

- ✅ User authentication (sign up, sign in, sign out)
- ✅ Cloud storage for expenses and user preferences
- ✅ Automatic migration from localStorage to Supabase
- ✅ Real-time data synchronization
- ✅ Secure data access with Row Level Security
- ✅ User-specific currency preferences

## How it Works

1. **Authentication**: Users can sign up or sign in using email/password
2. **Data Migration**: On first login, any existing localStorage data is automatically migrated to Supabase
3. **Cloud Sync**: All new expenses and preferences are saved to Supabase in real-time
4. **Security**: RLS ensures users can only access their own data
