CREATE OR REPLACE VIEW application_members_detail AS
SELECT
  am.application_id,
  m.id AS member_id,
  m.name_en AS member_name_en,
  m.name_ar AS member_name_ar,
  m.email AS member_email,
  m.phone AS member_phone,
  m.university,
  m.major,
  m.university_id
FROM application_members am
JOIN members m ON m.id = am.member_id;
