'use client'
import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import { Button } from '@/components/shadcn/button'
import { Label } from '@/components/shadcn/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/shadcn/select'

/* ========================== CONFIG DATA ========================== */

const TRACK_OPTIONS = [
  { value: 'ai', label: 'AI' },
  { value: 'health', label: 'Health' },
  { value: 'env', label: 'Environment' },
]

const MEMBER_FIELDS = [
  { name: 'nameAr', label: 'Arabic Name', placeholder: 'الاسم بالعربية', required: true },
  { name: 'nameEn', label: 'English Name', placeholder: 'Name in English', required: true },
  { name: 'phone', label: 'Phone Number', placeholder: '+966...', required: true },
  { name: 'email', label: 'Email', placeholder: 'email@example.com', required: true },
  { name: 'university', label: 'University', placeholder: 'KAU / Others', required: true },
  { name: 'uniId', label: 'University ID', placeholder: 'If applicable', required: false },
  { name: 'major', label: 'Major', placeholder: 'Computer Science', required: true },
]

/* ========================== MAIN COMPONENT ========================== */

export default function ApplyPage() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      teamName: '',
      track: '',
      ideaTitle: '',
      ideaDescription: '',
      attachment: null,
      members: [
        {
          nameAr: '',
          nameEn: '',
          gender: '',
          phone: '',
          email: '',
          university: '',
          uniId: '',
          major: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'members' })

  const watchTrack = watch('track')
  const watchAttachment = watch('attachment')
  const watchMembers = watch('members')

  const onSubmit = (data) => {
    console.log('✅ Form Submitted:', data)
    alert('🎉 Your application has been submitted successfully!')
  }

  /** ✅ Deeply check nested field validity (works for members array) */
  const getBorderClass = (path) => {
    const parts = path.split('.')
    let error = errors
    let dirty = dirtyFields

    // safely drill down nested object
    for (const part of parts) {
      error = error?.[part]
      dirty = dirty?.[part]
    }

    if (error) return 'border-red-500'
    if (dirty) return 'border-green-500'
    return ''
  }

  const ErrorMessage = ({ message }) => (
    <div className='min-h-[1.25rem]'>
      {message && <p className='text-red-500 text-sm mt-1'>{message}</p>}
    </div>
  )

  return (
    <div className='flex flex-col gap-10 bg-gradient-to-b from-[#0F0723] via-[#3B1C89] to-[#0EA5E9] min-h-screen'>
      <div className='container w-full max-w-5xl p-10 mx-auto flex flex-col gap-10'>
        <h1 className='text-5xl md:text-7xl font-bold text-white text-center'>
          Apply Page
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-10'>

          {/* ===================== Hackathon Info ===================== */}
          <div className='bg-white rounded-3xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.5)]'>
            <h2 className='text-3xl font-semibold text-primary mb-5'>
              Hackathon Information
            </h2>

            <div className='grid gap-5 md:grid-cols-2'>
              {/* Team Name */}
              <div>
                <Label>Team Name</Label>
                <Input
                  className={getBorderClass('teamName')}
                  {...register('teamName', { required: 'Team name is required' })}
                  placeholder='Your team name'
                />
                <ErrorMessage message={errors.teamName?.message} />
              </div>

              {/* Track */}
              <div>
                <Label>Track</Label>
                <Select
                  onValueChange={(value) =>
                    setValue('track', value, { shouldDirty: true })
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.track
                        ? 'border-red-500'
                        : watchTrack
                        ? 'border-green-500'
                        : ''
                    }`}
                  >
                    <SelectValue placeholder='Select track' />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACK_OPTIONS.map((track) => (
                      <SelectItem key={track.value} value={track.value}>
                        {track.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ErrorMessage message={errors.track?.message} />
              </div>
            </div>

            {/* Idea Section */}
            <div className='grid gap-5'>
              <div>
                <Label>Idea Title</Label>
                <Input
                  className={getBorderClass('ideaTitle')}
                  {...register('ideaTitle', { required: 'Idea title is required' })}
                  placeholder='Project idea title'
                />
                <ErrorMessage message={errors.ideaTitle?.message} />
              </div>

              <div>
                <Label>Idea Description</Label>
                <Textarea
                  className={getBorderClass('ideaDescription')}
                  {...register('ideaDescription', {
                    required: 'Please describe your idea',
                    minLength: {
                      value: 20,
                      message: 'Description must be at least 20 characters',
                    },
                  })}
                  placeholder='Describe your idea'
                  rows={5}
                />
                <ErrorMessage message={errors.ideaDescription?.message} />
              </div>

              {/* Attachment */}
              <div>
                <Label>Attachment (PDF)</Label>
                <Input
                  type='file'
                  accept='.pdf'
                  className={`${
                    errors.attachment
                      ? 'border-red-500'
                      : watchAttachment?.length
                      ? 'border-green-500'
                      : ''
                  }`}
                  {...register('attachment', {
                    validate: (value) =>
                      !value?.length ||
                      value[0]?.type === 'application/pdf' ||
                      'Only PDF files are allowed',
                  })}
                />
                <ErrorMessage message={errors.attachment?.message} />
              </div>
            </div>
          </div>

          {/* ===================== Team Information ===================== */}
          <div className='bg-white rounded-3xl p-6 shadow-[0_0_20px_rgba(255,255,255,0.5)]'>
            <h2 className='text-3xl font-semibold text-primary mb-5'>
              Team Information
            </h2>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className='border border-gray-200 rounded-xl p-4 mb-5'
              >
                <h3 className='font-bold text-lg mb-4 text-primary'>
                  Member {index + 1}
                </h3>

                <div className='grid md:grid-cols-2 gap-4'>
                  {MEMBER_FIELDS.map(({ name, label, placeholder, required }) => (
                    <div key={name}>
                      <Label>{label}</Label>
                      <Input
                        className={getBorderClass(`members.${index}.${name}`)}
                        {...register(`members.${index}.${name}`, {
                          required: required ? `${label} is required` : false,
                        })}
                        placeholder={placeholder}
                      />
                      <ErrorMessage
                        message={errors.members?.[index]?.[name]?.message}
                      />
                    </div>
                  ))}

                  {/* Gender */}
                  <div>
                    <Label>Gender</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(`members.${index}.gender`, value, {
                          shouldDirty: true,
                        })
                      }
                    >
                      <SelectTrigger
                        className={`w-full ${
                          errors.members?.[index]?.gender
                            ? 'border-red-500'
                            : watchMembers?.[index]?.gender
                            ? 'border-green-500'
                            : ''
                        }`}
                      >
                        <SelectValue placeholder='Select gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='male'>Male</SelectItem>
                        <SelectItem value='female'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      message={errors.members?.[index]?.gender?.message}
                    />
                  </div>
                </div>

                {fields.length > 1 && (
                  <Button
                    type='button'
                    onClick={() => remove(index)}
                    variant='destructive'
                    className='mt-4'
                  >
                    Remove Member
                  </Button>
                )}
              </div>
            ))}

            {fields.length < 5 && (
              <Button
                type='button'
                onClick={() =>
                  append({
                    nameAr: '',
                    nameEn: '',
                    gender: '',
                    phone: '',
                    email: '',
                    university: '',
                    uniId: '',
                    major: '',
                  })
                }
                variant='outline'
              >
                + Add Member
              </Button>
            )}
          </div>

          <Button
            type='submit'
            size='lg'
            className='self-center bg-black text-white w-full text-2xl font-bold hover:scale-95 transition-transform max-w-md'
          >
            Submit Application
          </Button>
        </form>
      </div>
    </div>
  )
}
