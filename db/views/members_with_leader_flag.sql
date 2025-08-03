CREATE OR REPLACE VIEW members_with_leader_flag AS
SELECT
  m.id AS member_id,
  m.name_en,
  m.name_ar,
  m.email,
  m.phone,
  m.university,
  m.major,
  m.university_id,
  EXISTS (
    SELECT 1 FROM applications a WHERE a.leader_id = m.id
  ) AS is_leader
FROM members m;
