'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/common/header'
import { Countdown } from '@/components/count-down'
import { useTranslations } from 'next-intl'
import { CalendarRange, ChevronLeft, ChevronRight, MapPin, SaudiRiyal } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import Link from 'next/link'
import { Card, CardContent } from '@/components/shadcn/card'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export default function Page() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <PrizesAndRules />
      <Community />
      <Sponsors />
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
        <h3 className='text-5xl lg:text-7xl font-bold text-primary tracking-tight'>{t('title')}</h3>
        <p className='text-2xl lg:text-5xl'>{t('description')}</p>
      </div>
    </div>
  )
}

// Prizes & Rules
function PrizesAndRules() {
  const t = {
    prizes: useTranslations('home.prizes'),
    rules: useTranslations('home.rules')
  }
  return (
    <>
      <div className='container mx-auto px-2 h-screen mb-[50lvh] flex flex-col items-center justify-center gap-20 md:gap-0 md:justify-evenly'>
        <h3 className='text-7xl lg:text-9xl font-bold text-primary tracking-tight capitalize text-center'>
          {t.prizes('title')}
        </h3>
        <div className='flex flex-col gap-5 items-center justify-center font-bold text-[#ABB8C2]'>
          <p className='text-center text-4xl'>{t.prizes('up_to')}</p>

          <div className='flex gap-4 items-center rtl:flex-row-reverse'>
            <SaudiRiyal className='size-full' />
            <p className='text-6xl lg:text-9xl text-cyan-primary font-bold'>999,999</p>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-2 absolute h-screen w-screen p-10 -z-50">
          <div className="relative">
            <img src="./images/puzzle_2.png" className="absolute top-0 start-0 m-2" />
          </div>

          <div className="relative">
            <img src="./images/puzzle_1.png" className="absolute top-0 end-0 m-2 hidden md:block" />
          </div>

          <div className="relative">
            <img src="./images/puzzle_4.png" className="absolute bottom-0 start-0 m-2 hidden md:block" />
          </div>

          <div className="relative">
            <img src="./images/puzzle_3.png" className="absolute bottom-0 end-0 m-2" />
          </div>
        </div>
      </div>
      <div className='grid place-items-end justify-center bg-gradient-to-b from-[#0F0723] to-[#3B1C89] min-h-screen p-5 relative'>
        <img src="./images/prizes_illustration.svg" className='absolute -top-[50lvh] -left-0 h-screen z-10' />
        <div className='flex flex-col gap-4 z-20 mt-[50lvh]'>
          <h3 className='text-7xl lg:text-9xl font-bold  text-white tracking-tight capitalize text-center'>
            {t.rules('title')}
          </h3>
          <Card
            className="text-white bg-gradient-to-b from-[#0F0723] to-[#251256] border-white/20 shadow-lg container mx-auto lg:w-4xl p-5"
          >
            <CardContent className='text-white font-semibold'>
              <ol className='flex flex-col gap-5 list-decimal text-2xl font-semibold'>
                {t.rules.raw('rules_list').map((rule, index) =>
                  <li key={index}>{rule}</li>
                )}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
// join community
function Community() {
  const t = useTranslations('home.community')
  return (
    <div className='grid grid-cols-3 grid-rows-3 px-2 py-5 container mx-auto place-items-center'>
      <img src="./images/discord-logo.png" className="col-start-2" loading='lazy' />
      <img src="./images/quote-icon-3d.png" className="hidden md:block row-start-2 col-start-1 rotate-180" loading='lazy' />
      <p className='row-start-2 col-span-3 md:col-span-1 md:col-start-2 text-3xl text-center font-bold'>{t('description')}</p>
      <img src="./images/quote-icon-3d.png" className="hidden md:block row-start-2 col-start-3 self-center place-self-center" loading='lazy' />
      <div className="row-start-3 col-span-3 md:col-span-1 md:col-start-2 flex bg-blue-300 w-full justify-center">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button size="lg" className="w-full h-20 text-lg md:text-2xl font-bold">
            {t('cta')}
          </Button>
        </a>
      </div>
    </div>
  )
}

// Sponsors, Credits for SponsorsCarousel: chatGPT and ClaudeAI
function Sponsors() {
  const t = useTranslations('home.sponsors');
  const goldPartners = [
    { id: 1, logo: "/images/partner-kau.png", name: "KAU" },
    { id: 2, logo: "/images/partner-kau.png", name: "kau" },
  ];
  const silverPartners = [
    { id: 1, logo: "/images/partner-abaad.png", name: "KAU" },
    { id: 2, logo: "/images/partner-abaad.png", name: "kau" },
  ];
  return (
    <div className='flex flex-col gap-5 justify-center items-center h-screen py-5'>
      <h3 className='text-7xl lg:text-9xl font-bold text-primary tracking-tight capitalize text-center'>
        {t("title")}
      </h3>
      <p className='font-semibold text-2xl text-cyan-primary'>{t("gold")}</p>
      <SponsorsCarousel partners={goldPartners} />
      <p className='font-semibold text-2xl text-cyan-primary'>{t("silver")}</p>
      <SponsorsCarousel partners={silverPartners} />
    </div>
  );

}
function SponsorsCarousel({ partners = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full container mx-auto" dir='ltr'>
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex-[0_0_100%] flex items-center justify-center p-8"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-1/2 object-contain text-center grid place-items-center font-semibold"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-shadow-cyan-primary"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-10 text-cyan-primary" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-shadow-cyan-primary"
        aria-label="Next slide"
      >
        <ChevronRight className="size-10 text-cyan-primary" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {partners.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === selectedIndex
              ? "bg-primary w-6"
              : "bg-gray-300 hover:bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}