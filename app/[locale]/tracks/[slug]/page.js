"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import Link from "next/link";
import { H1 } from "@/components/shadcn/typography-h1";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Button } from "@/components/shadcn/button";

// Valid track slugs
const validSlugs = ["health", "safety", "innovation", "vehicle"];

export default function TrackPage({ params }) {
  // Unwrap params promise for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;

  // Check if slug is valid
  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const t = {
    tracks: useTranslations("tracks"),
    track: useTranslations(`tracks.${slug}`),
    shared: useTranslations("shared"),
  };

  const trackColor = t.track("color");

  return (
    <main className="flex flex-col gap-20 py-5">
      <Heading
        title={t.track("title")}
        description={t.track("subtitle")}
        icon={t.track("icon")}
        puzzle={t.track("puzzle")}
        color={trackColor}
      />

      <div className="w-full max-w-7xl mx-auto flex flex-col gap-20 px-4">
        <Overview
          title={t.tracks("overview")}
          overview={t.track("overview")}
          color={trackColor}
        />
        <Goals
          title={t.tracks("goalsTitle")}
          aGoal={t.tracks("goal")}
          goals={t.track.raw("goals")}
          color={trackColor}
        />
        <Challenges
          title={t.tracks("challenges")}
          challenges={t.track.raw(`challenges`)}
          aChallenge={t.tracks("aChallenge")}
          puzzles={t.track("puzzles")}
          color={trackColor}
          firstChallenge={t.tracks("firstChallenge")}
          secondChallenge={t.tracks("secondChallenge")}
        />
        {/* Sponsors Section */}
        <Sponsors
          title={t.tracks("sponsors.strategic")}
          sponsors={t.tracks.raw("sponsors.sponsors")}
        />
        <Link href={`/apply`} className="w-full max-w-4xl mx-auto">
          <Button
            className="w-full font-black text-lg py-6 hover:opacity-95"
            size="lg"
            style={{
              background: t.track("color"),
            }}
          >
            {t.shared("cta")}
          </Button>
        </Link>
      </div>
    </main>
  );
}

function Heading({ title, description, icon, puzzle, color }) {
  return (
    <section
      className={`relative bg-gradient-to-r rtl:bg-gradient-to-l to-white px-2 py-8 text-white h-56`}
      style={{ "--tw-gradient-from": color, "--tw-gradient-to": "#e6e6e650" }}
    >
      <Image
        src={puzzle}
        width={224}
        height={224}
        className="aspect-square h-full absolute inset-y-1/2 end-0 ltr:scale-x-[-1]"
        alt=""
      />
      <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-3 justify-evenly h-full">
        <H1>{title}</H1>
        <p className="bg-gradient-to-r rtl:bg-gradient-to-l from-white/20 to-transparent p-2 pe-5">
          {description}
        </p>
        <div className="size-44 absolute inset-0 py-2">
          <Image src={icon} alt="" fill className="object-contain p-2" />
        </div>
      </div>
    </section>
  );
}
function Overview({ title, overview, color }) {
  return (
    <section>
      <h2
        className="text-4xl font-extrabold mb-4 text-center"
        style={{ color }}
        data-aos="fade-up"
      >
        {title}
      </h2>
      <p className="text-center text-xl max-w-3xl mx-auto" data-aos="fade-up">
        {overview}
      </p>
    </section>
  );
}
function Goals({ title, goals, aGoal, color }) {
  return (
    <section>
      <h2
        className="text-4xl font-extrabold mb-4 text-center"
        style={{ color }}
        data-aos="fade-up"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-8 lg:gap-12 text-white">
        {goals.map((goal, index) => {
          let roundedClass = "";
          if (index === 0 || index === 3) {
            roundedClass = "rounded-tl-4xl rounded-br-4xl";
          } else if (index === 1 || index === 2) {
            roundedClass = "rounded-tr-4xl rounded-bl-4xl";
          }

          return (
            <div
              key={index}
              className={`p-10 ${roundedClass}`}
              style={{ backgroundColor: goal.background }}
              data-aos="fade-up"
            >
              <p className="!text-2xl font-bold">{goal.goal}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function Challenges({ title, aChallenge, challenges, puzzles, color, firstChallenge, secondChallenge }) {
  return (
    <section>
      <h2
        className="text-4xl font-extrabold mb-4 text-center"
        style={{ color }}
        data-aos="fade-up"
      >
        {title}
      </h2>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 py-10">
        {/* Left challenge */}
        <div className="flex flex-col gap-4 text-center" data-aos="fade-up">
          <h3 className="!text-2xl font-extrabold" style={{ color }}>
            {firstChallenge}
          </h3>
          <p className="text-sm lg:text-lg max-w-md">{challenges[0]}</p>
        </div>

        {/* Center puzzle image */}
        <Image
          src={puzzles}
          width={192}
          height={192}
          className="w-32 lg:w-48"
          alt=""
          data-aos="fade-up"
        />

        {/* Right challenge */}
        <div className="flex flex-col gap-4 text-center" data-aos="fade-up">
          <h3 className="!text-2xl font-extrabold" style={{ color }}>
            {secondChallenge}
          </h3>
          <p className="text-sm lg:text-lg max-w-md">{challenges[1]}</p>
        </div>
      </div>
    </section>
  );
}
function Sponsors({ title, sponsors = [], color }) {
  const strategicSponsors = sponsors[0];
  console.log(sponsors);
  return (
    <section>
      <div className="flex flex-col gap-5 justify-center items-center py-5">
        <h3
          className="text-primary tracking-tight text-center"
          data-aos="fade-up"
        >
          {title}
        </h3>
        <Image
          src={strategicSponsors.logo}
          alt={strategicSponsors.name}
          width={300}
          height={150}
          className="w-1/2 object-contain text-center grid place-items-center"
          data-aos="fade-up"
        />
      </div>
    </section>
  );
}

function SponsorsCarousel({ sponsors = [] }) {
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
    <div className="relative w-full container mx-auto" dir="ltr">
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex-[0_0_100%] flex items-center justify-center p-8"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={300}
                height={150}
                className="w-1/2 object-contain text-center grid place-items-center"
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
        {sponsors.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
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
