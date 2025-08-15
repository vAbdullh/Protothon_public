-- Clear existing data (optional)
TRUNCATE TABLE applications CASCADE;
TRUNCATE TABLE application_members CASCADE;
TRUNCATE TABLE members CASCADE;
TRUNCATE TABLE application_actions CASCADE;
TRUNCATE TABLE application_attachments CASCADE;

-- Insert 10 dummy members following members.sql schema
INSERT INTO members (id, name_ar, name_en, gender, phone, email, university, major, university_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'عضو فريق 1', 'Dev Member 1', 'male', '0501111111', 'member1@test.com', 'Test University', 'Computer Science', 'STU001'),
  ('22222222-2222-2222-2222-222222222222', 'عضو فريق 2', 'Dev Member 2', 'female', '0502222222', 'member2@test.com', 'Test University', 'Engineering', 'STU002'),
  ('33333333-3333-3333-3333-333333333333', 'عضو فريق 3', 'Dev Member 3', 'male', '0503333333', 'member3@test.com', 'Test University', 'Business', 'STU003'),
  ('44444444-4444-4444-4444-444444444444', 'عضو فريق 4', 'Dev Member 4', 'female', '0504444444', 'member4@test.com', 'Test University', 'Design', 'STU004'),
  ('55555555-5555-5555-5555-555555555555', 'عضو فريق 5', 'Dev Member 5', 'male', '0505555555', 'member5@test.com', 'Test University', 'Marketing', 'STU005'),
  ('66666666-6666-6666-6666-666666666666', 'عضو فريق 6', 'Dev Member 6', 'female', '0506666666', 'member6@test.com', 'Test University', 'Finance', 'STU006'),
  ('77777777-7777-7777-7777-777777777777', 'عضو فريق 7', 'Dev Member 7', 'male', '0507777777', 'member7@test.com', 'Test University', 'Medicine', 'STU007'),
  ('88888888-8888-8888-8888-888888888888', 'عضو فريق 8', 'Dev Member 8', 'female', '0508888888', 'member8@test.com', 'Test University', 'Law', 'STU008'),
  ('99999999-9999-9999-9999-999999999999', 'عضو فريق 9', 'Dev Member 9', 'male', '0509999999', 'member9@test.com', 'Test University', 'Architecture', 'STU009'),
  ('00000000-0000-0000-0000-000000000000', 'عضو فريق 10', 'Dev Member 10', 'female', '0500000000', 'member10@test.com', 'Test University', 'Physics', 'STU010');

-- Insert 5 dummy applications following applications.sql schema
INSERT INTO applications (id, team_name, track, idea_title, idea_description, leader_id, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Dev Team 1', 'AI', 'AI Assistant', 'AI that helps with daily tasks (250 chars max)', '11111111-1111-1111-1111-111111111111', 'pending'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dev Team 2', 'Web3', 'Blockchain Platform', 'Decentralized application platform (250 chars max)', '22222222-2222-2222-2222-222222222222', 'approved'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Dev Team 3', 'IoT', 'Smart Home System', 'IoT system for home automation (250 chars max)', '33333333-3333-3333-3333-333333333333', 'rejected'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dev Team 4', 'AR/VR', 'Virtual Classroom', 'Immersive education platform (250 chars max)', '44444444-4444-4444-4444-444444444444', 'pending'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Dev Team 5', 'Robotics', 'Autonomous Delivery', 'Self-driving delivery robots (250 chars max)', '55555555-5555-5555-5555-555555555555', 'approved');

-- Insert application members following application_members.sql schema
-- Each member can only be in one application due to UNIQUE constraint on member_id
INSERT INTO application_members (application_id, member_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '77777777-7777-7777-7777-777777777777'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '99999999-9999-9999-9999-999999999999'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000000');

-- Insert application actions following application_actions.sql schema
INSERT INTO application_actions (application_id, action, action_note, updated_by)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'approved', 'Approved for next round', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'rejected', 'Not meeting requirements', '22222222-2222-2222-2222-222222222222'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'approved', 'Excellent proposal', '33333333-3333-3333-3333-333333333333');

-- Insert application attachments following application_attachments.sql schema
INSERT INTO application_attachments (application_id, file_url)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://example.com/files/proposal1.pdf'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://example.com/files/proposal2.pdf'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://example.com/files/proposal3.pdf');
