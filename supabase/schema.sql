-- AI Tutor Platform Database Schema
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for anonymous users - no auth required)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  email VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id VARCHAR(50) NOT NULL,
  unit_id VARCHAR(50) NOT NULL,
  subtopic_id VARCHAR(50) NOT NULL,
  phase VARCHAR(20) NOT NULL, -- 'theory', 'mcq', 'basic', 'medium', 'hard', 'assignment'
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subject_id, unit_id, subtopic_id, phase)
);

-- User Stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank INTEGER DEFAULT 999999,
  problems_solved INTEGER DEFAULT 0,
  contests_won INTEGER DEFAULT 0,
  duels_won INTEGER DEFAULT 0,
  duels_lost INTEGER DEFAULT 0,
  marathons_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  average_time_per_problem INTEGER DEFAULT 0, -- in seconds
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id VARCHAR(100) NOT NULL,
  badge_name VARCHAR(100) NOT NULL,
  badge_description TEXT,
  badge_icon VARCHAR(50),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Contests table
CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  level VARCHAR(20) NOT NULL, -- 'city', 'state', 'national', 'global'
  status VARCHAR(20) NOT NULL, -- 'upcoming', 'active', 'ended'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  xp_multiplier DECIMAL(3,2) DEFAULT 1.0,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contest Problems table
CREATE TABLE IF NOT EXISTS contest_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
  problem_id VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) NOT NULL, -- 'Basic', 'Medium', 'Advanced'
  points INTEGER DEFAULT 100,
  order_index INTEGER DEFAULT 0,
  test_cases JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contest Participants table
CREATE TABLE IF NOT EXISTS contest_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  total_score INTEGER DEFAULT 0,
  problems_solved INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(contest_id, user_id)
);

-- Contest Submissions table
CREATE TABLE IF NOT EXISTS contest_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES contests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES contest_problems(id) ON DELETE CASCADE,
  code TEXT,
  language VARCHAR(20),
  status VARCHAR(20), -- 'pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error'
  score INTEGER DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Duels table
CREATE TABLE IF NOT EXISTS duels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenger_id UUID REFERENCES users(id) ON DELETE CASCADE,
  opponent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL, -- 'pending', 'active', 'completed', 'cancelled'
  problem_id VARCHAR(100),
  problem_title VARCHAR(200),
  problem_description TEXT,
  challenger_solution TEXT,
  opponent_solution TEXT,
  challenger_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  winner_id UUID REFERENCES users(id),
  xp_reward INTEGER DEFAULT 50,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Standoffs table (3v3)
CREATE TABLE IF NOT EXISTS standoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team1_leader UUID REFERENCES users(id) ON DELETE CASCADE,
  team1_member2 UUID REFERENCES users(id) ON DELETE CASCADE,
  team1_member3 UUID REFERENCES users(id) ON DELETE CASCADE,
  team2_leader UUID REFERENCES users(id) ON DELETE CASCADE,
  team2_member2 UUID REFERENCES users(id) ON DELETE CASCADE,
  team2_member3 UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL, -- 'pending', 'active', 'completed', 'cancelled'
  problem_id VARCHAR(100),
  problem_title VARCHAR(200),
  team1_score INTEGER DEFAULT 0,
  team2_score INTEGER DEFAULT 0,
  winner_team INTEGER, -- 1 or 2
  xp_reward INTEGER DEFAULT 100,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marathons table
CREATE TABLE IF NOT EXISTS marathons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL, -- 'upcoming', 'active', 'ended'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in hours
  xp_multiplier DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marathon Participants table
CREATE TABLE IF NOT EXISTS marathon_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marathon_id UUID REFERENCES marathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problems_solved INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(marathon_id, user_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_subject ON user_progress(subject_id, unit_id, subtopic_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_rank ON user_stats(rank);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_contests_status ON contests(status);
CREATE INDEX IF NOT EXISTS idx_contest_participants_contest ON contest_participants(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_participants_user ON contest_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_duels_status ON duels(status);
CREATE INDEX IF NOT EXISTS idx_duels_challenger ON duels(challenger_id);
CREATE INDEX IF NOT EXISTS idx_duels_opponent ON duels(opponent_id);
CREATE INDEX IF NOT EXISTS idx_marathons_status ON marathons(status);
CREATE INDEX IF NOT EXISTS idx_marathon_participants_marathon ON marathon_participants(marathon_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at BEFORE UPDATE ON user_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contests_updated_at BEFORE UPDATE ON contests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marathons_updated_at BEFORE UPDATE ON marathons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


