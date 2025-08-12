CREATE OR REPLACE VIEW application_detail AS
SELECT
  a.id AS application_id,
  a.team_name,
  a.track,
  a.idea_title,
  a.idea_description,
  a.status,
  a.created_at AS application_created_at,

  -- Leader info
  m.id AS leader_id,
  m.name_en AS leader_name_en,
  m.name_ar AS leader_name_ar
FROM applications a
JOIN members m ON m.id = a.leader_id;
