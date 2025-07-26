CREATE OR REPLACE VIEW team_detail AS
SELECT
  t.id AS team_id,
  t.team_name,
  t.track,
  t.idea_title,
  t.idea_description,
  t.status,
  t.created_at AS team_created_at,

  -- Leader info
  u.id AS leader_id,
  u.name_en AS leader_name_en,
  u.name_ar AS leader_name_ar,
  u.email AS leader_email,
  u.phone AS leader_phone,
  u.university,
  u.major,
  u.university_id

FROM teams t
JOIN users u ON u.id = t.leader_id;
