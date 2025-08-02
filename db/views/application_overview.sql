CREATE OR REPLACE VIEW application_overview AS
SELECT
  a.id AS application_id,
  a.team_name,
  a.track,
  a.idea_title,
  a.status,
  a.leader_id,
  m.name_en AS leader_name_en,
  m.name_ar AS leader_name_ar,
  a.created_at AS application_created_at,
  COUNT(am.member_id) AS member_count
FROM applications a
JOIN members m ON m.id = a.leader_id
LEFT JOIN application_members am ON am.application_id = a.id
GROUP BY a.id, a.team_name, a.track, a.idea_title, a.status, a.leader_id, m.name_en, m.name_ar;
