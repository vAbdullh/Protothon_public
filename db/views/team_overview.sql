CREATE OR REPLACE VIEW team_overview AS
SELECT
  t.id AS team_id,
  t.team_name,
  t.track,
  t.idea_title,
  t.status,
  t.leader_id,
  u.name_en AS leader_name_en,
  u.name_ar AS leader_name_ar,
  t.created_at AS team_created_at,
  COUNT(tm.user_id) AS member_count
FROM teams t
JOIN users u ON u.id = t.leader_id
LEFT JOIN team_members tm ON tm.team_id = t.id
GROUP BY t.id, t.team_name, t.track, t.idea_title, t.status, t.leader_id, u.name_en, u.name_ar;
