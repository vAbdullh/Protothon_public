'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Textarea } from '@/components/shadcn/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card';
import { H3 } from '@/components/shadcn/typography-h3';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ApplicationFormPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const t = useTranslations('applicationForm');

  // Form state
  const [application, setApplication] = useState({
    team_name: '',
    track: '',
    idea_title: '',
    idea_description: '',
    status: 'pending'
  });

  const [members, setMembers] = useState([
    {
      name_ar: '',
      name_en: '',
      gender: '',
      phone: '',
      email: '',
      university: '',
      major: '',
      university_id: '',
      is_leader: true
    }
  ]);

  const [attachments, setAttachments] = useState([{ file_url: '' }]);

  // Track options
  const trackOptions = [
    'track1',
    'track2',
    'track3'
  ];

  // Handle application field changes
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplication(prev => ({ ...prev, [name]: value }));
  };

  // Handle member field changes
  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [name]: value };
    setMembers(updatedMembers);
  };

  // Handle attachment field changes
  const handleAttachmentChange = (index, e) => {
    const { value } = e.target;
    const updatedAttachments = [...attachments];
    updatedAttachments[index] = { file_url: value };
    setAttachments(updatedAttachments);
  };

  // Add new member
  const addMember = () => {
    setMembers([...members, {
      name_ar: '',
      name_en: '',
      gender: '',
      phone: '',
      email: '',
      university: '',
      major: '',
      university_id: '',
      is_leader: false
    }]);
  };

  // Add new attachment
  const addAttachment = () => {
    setAttachments([...attachments, { file_url: '' }]);
  };

  // Remove member
  const removeMember = (index) => {
    if (members.length > 1) {
      const updatedMembers = members.filter((_, i) => i !== index);
      setMembers(updatedMembers);
    }
  };

  // Remove attachment
  const removeAttachment = (index) => {
    if (attachments.length > 1) {
      const updatedAttachments = attachments.filter((_, i) => i !== index);
      setAttachments(updatedAttachments);
    }
  };

  // Fill with dummy data for testing
  const fillDummyData = () => {
    setApplication({
      team_name: 'Innovation Squad',
      track: 'Technology',
      idea_title: 'Smart Campus Solution',
      idea_description: 'A comprehensive platform to enhance campus life through IoT and mobile integration.',
      status: 'pending'
    });

    setMembers([
      {
        name_ar: 'محمد أحمد',
        name_en: 'Mohammed Ahmed',
        gender: 'male',
        phone: '+966500123456',
        email: 'mohammed@example.com',
        university: 'King Saud University',
        major: 'Computer Engineering',
        university_id: '202010001',
        is_leader: true
      },
      {
        name_ar: 'فاطمة علي',
        name_en: 'Fatima Ali',
        gender: 'female',
        phone: '+966511223344',
        email: 'fatima@example.com',
        university: 'Princess Nourah University',
        major: 'Information Technology',
        university_id: '202020002',
        is_leader: false
      }
    ]);

    setAttachments([
      { file_url: 'https://example.com/project-proposal.pdf' },
      { file_url: 'https://example.com/team-cv.pdf' }
    ]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          application,
          members,
          attachments
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSuccess('Application submitted successfully!');
      setTimeout(() => {
        router.push('/dashboard/applications');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <H3>{t('title')}</H3>
        <Button
          type="button"
          variant="outline"
          onClick={fillDummyData}
          className="bg-yellow-100 hover:bg-yellow-200"
        >
          {t('fillDummyData')}
        </Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Application Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('applicationDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="team_name"
              placeholder={t('teamName')}
              value={application.team_name}
              onChange={handleApplicationChange}
              required
            />
            <select
              name="track"
              value={application.track}
              onChange={handleApplicationChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">{t('track')}</option>
              {trackOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <Input
              name="idea_title"
              placeholder={t('ideaTitle')}
              value={application.idea_title}
              onChange={handleApplicationChange}
              required
            />
            <Textarea
              name="idea_description"
              placeholder={t('ideaDescription')}
              value={application.idea_description}
              onChange={handleApplicationChange}
              maxLength={250}
              required
            />
            <small className="text-gray-500">{application.idea_description.length}/250</small>
          </CardContent>
        </Card>

        {/* Members Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('teamMembers')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="border p-4 rounded space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{t('member')} {index + 1}</h4>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMember(index)}
                    >
                      {t('remove')}
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    name="name_ar"
                    placeholder={t('nameAr')}
                    value={member.name_ar}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="name_en"
                    placeholder={t('nameEn')}
                    value={member.name_en}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="gender"
                    placeholder={t('gender')}
                    value={member.gender}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="phone"
                    placeholder={t('phone')}
                    value={member.phone}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder={t('email')}
                    value={member.email}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="university"
                    placeholder={t('university')}
                    value={member.university}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="major"
                    placeholder={t('major')}
                    value={member.major}
                    onChange={(e) => handleMemberChange(index, e)}
                    required
                  />
                  <Input
                    name="university_id"
                    placeholder={t('universityId')}
                    value={member.university_id}
                    onChange={(e) => handleMemberChange(index, e)}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addMember}>
              {t('addMember')}
            </Button>
          </CardContent>
        </Card>

        {/* Attachments Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('attachments')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={t('fileUrl')}
                  value={attachment.file_url}
                  onChange={(e) => handleAttachmentChange(index, e)}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    {t('remove')}
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addAttachment}>
              {t('addAttachment')}
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
}
