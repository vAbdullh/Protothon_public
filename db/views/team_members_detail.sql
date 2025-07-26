CREATE OR REPLACE VIEW team_members_detail AS
SELECT
  tm.team_id,
  u.id AS member_id,
  u.name_en AS member_name_en,
  u.name_ar AS member_name_ar,
  u.email AS member_email,
  u.phone AS member_phone,
  u.university,
  u.major,
  u.university_id

FROM team_members tm
JOIN users u ON u.id = tm.user_id;
