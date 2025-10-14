'use client'

import React from 'react'
import Header from '@/components/common/header'
import { Countdown } from '@/components/count-down'
import { useTranslations } from 'next-intl'
import { CalendarRange, MapPin } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <About />
    </>
  )
}
// home page section

// Hero. Credit ChatGPT
function Hero() {
  const t = useTranslations('shared')

  return (
    <section className="relative flex-1 h-screen flex items-center justify-center">
      <Countdown
        targetDate={1767225600000}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-50"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F0723] via-[#3B1C89] to-[#0EA5E9]" />

      {/* Background overlay */}
      <img
        src="/images/hero-overlay.jpg"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        loading='lazy'
      />

      {/* Foreground content */}

      <div className='flex justify-center lg:justify-evenly gap-10 flex-col text-white lg:text-start container mx-auto h-full z-50 px-2'>
        <h1 className="text-5xl md:text-9xl font-bold">{t('protothon')}</h1>
        <div className='flex flex-col lg:flex-row lg:justify-center lg:items-center gap-3 mx-auto lg:gap-14 font-extrabold text-sm lg:text-xl'>
          <div className='flex gap-2 items-center lg:h-11 w-auto'>
            <CalendarRange className='lg:size-11' />
            <div className='flex flex-col gap-2'>
              <p>
                01 - 10 / 01 / 2026
              </p>
              <p>
                8:00 AM - 12:00 PM
              </p>
            </div>
          </div>

          {/* divider */}
          <div className="h-px w-full bg-gray-300 my-4 lg:my-0 lg:h-full lg:w-1"></div>

          <div className='flex gap-2 items-center lg:h-11 w-auto'>
            <MapPin className='lg:size-11' />
            <div className='flex flex-col gap-2'>
              <p>{t('university')}</p>
              <p>{t('venue')}</p>
            </div>
          </div>
        </div>
        <Link href={'/apply'} className='w-full md:w-fit mx-auto'>
          <Button variant='default' className='w-full md:w-xl py-9 text-2xl font-extrabold'>{t('cta')}</Button>
        </Link>
      </div>
    </section>
  )
}

// About
function About() {
  const t = useTranslations('home.about');
  return (
    <div className='h-screen relative flex justify-start items-center'>
      <img
        src="/images/filament-about.png"
        className="absolute bottom-0 left-0 object-cover object-top-right h-auto w-auto aspect-auto max-w-1/2"
        loading="lazy"
      />
      <div className='container mx-auto px-2 flex flex-col h-fit items-start justify-center gap-4 md:gap-6'>
        <h3 className='text-5xl lg:text-7xl font-bold text-primary tracking-tight'>{t('heading')}</h3>
        <p className='text-2xl lg:text-5xl'>{t('description')}</p>
      </div>
    </div>
  )
}