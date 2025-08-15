CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT UNIQUE NOT NULL,
  track TEXT NOT NULL,
  idea_title TEXT NOT NULL,
  idea_description TEXT NOT NULL CHECK (char_length(idea_description) <= 250),
  leader_id UUID NOT NULL REFERENCES members(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  action_note TEXT CHECK (char_length(action_note) <= 100)
);