"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Countdown } from "@/components/count-down";
import { useTranslations } from "next-intl";
import { CalendarRange, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/shadcn/card";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <Hero />
      <About />
      <Tracks />
      <Stages />
      <AdvantagesAndRules />
      <Community />
      <Sponsors />
    </>
  );
}
// home page section

// Hero. Credit ChatGPT
function Hero() {
  const t = useTranslations("shared");

  return (
    <section className="relative flex-1 h-screen flex items-center justify-center">
      <Countdown
        targetDate={"2025-12-04T23:59:59"}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-50"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#091233] via-[#3B1C89] to-[#0EA5E9] z-10 opacity-70" />

      <Image
        src="/images/hero-overlay-md.png"
        fill
        className="absolute inset-0 object-cover object-top-left"
        alt=""
        loading="eager"
      />

      {/* Foreground content */}

      <div className="flex justify-center lg:justify-evenly gap-10 flex-col text-white lg:text-start container mx-auto h-full z-50 px-2">
        <h1 className="text-5xl md:text-9xl font-bold  text-center">
          {t("protothon")}
        </h1>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-3 mx-auto lg:gap-14 font-extrabold text-sm lg:text-xl">
          <div className="flex gap-2 items-center lg:justify-end lg:h-11 w-fit lg:w-96">
            <CalendarRange className="lg:size-11" />
            <div className="flex flex-col gap-2">
              <p>11-14/01/2026</p>
              <p>8:00AM - 12:00PM</p>
            </div>
          </div>

          {/* divider */}
          <div className="h-px w-full bg-gray-300 my-4 lg:my-0 lg:h-full lg:w-1"></div>

          <div className="flex gap-2 items-center lg:h-11 w-full lg:w-96">
            <MapPin className="lg:size-11" />
            <div className="flex flex-col gap-2">
              <p>{t("university")}</p>
              <p>{t("venue")}</p>
            </div>
          </div>
        </div>
        <Link href={"/apply"} className="w-full md:w-fit mx-auto">
          <Button
            size="default"
            variant="default"
            className="w-full md:w-xl py-7 text-2xl font-extrabold bg-white text-primary hover:bg-white/90"
          >
            {t("cta")}
          </Button>
        </Link>
      </div>
    </section>
  );
}

// About
function About() {
  const t = useTranslations("home.about");
  return (
    <div id="about" className="pt-40 relative flex items-center">
      <div className="absolute top-full left-0 z-10 w-[100px] h-[200px] lg:w-[200px] lg:h-[400px]">
        <Image
          src="/images/filament-about.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 flex flex-col h-fit items-start justify-center gap-10 lg:gap-20 md:gap-6 w-full max-w-7xl z-50">
        <h3 className="text-primary" data-aos="fade-up">
          {t("title")}
        </h3>
        <p className="text-lg lg:text-3xl" data-aos="fade-up">
          {t("description")}
        </p>
      </div>
    </div>
  );
}

const TrackContainer = ({
  from,
  title,
  description,
  illustration,
  reverse,
  link,
}) => {
  const t = useTranslations("shared");
  return (
    <>
      <div
        className="max-lg:hidden lg:grid grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 w-screen h-1/2 text-center"
        data-aos="fade-up"
      >
        <div
          className={`w-full p-5 flex flex-col justify-center gap-10 relative ${
            reverse ? "lg:order-2" : ""
          }`}
          style={{
            background: `linear-gradient(to bottom, ${from}, #E6E6E6)`,
          }}
        >
          <h4 className="text-4xl font-extrabold">{title}</h4>
          <p className="lg:text-2xl">{description}</p>
          <Link
            href={`/tracks${link}`}
            className="absolute w-80 -bottom-5 inset-x-1/2 -translate-x-1/2 rtl:translate-x-1/2"
          >
            <Button
              className="w-full bg-white hover:bg-[#e6e6e6] font-black text-lg py-6"
              size="lg"
              style={{
                color: from,
              }}
            >
              {t("details")}
            </Button>
          </Link>
        </div>
        <div className="relative order-1 lg:order-0 grid place-items-center p-10">
          <Image
            src={illustration}
            alt=""
            width={400}
            height={300}
            className="filter drop-shadow-[0_0_15px_rgba(255,255,255,0.20)]"
          />
        </div>
      </div>
      <div
        className={`w-4/5 text-center px-5 grid place-items-center py-16 gap-8 relative lg:hidden p-5
    ${
      reverse
        ? "ml-auto text-right ltr:rounded-l-2xl rtl:ml-0 rtl:mr-auto rtl:text-left rtl:rounded-r-2xl"
        : "mr-auto text-left ltr:rounded-r-2xl rtl:mr-0 rtl:ml-auto rtl:text-right rtl:rounded-l-2xl"
    }
  `}
        style={{
          background: `linear-gradient(to bottom, ${from}, #E6E6E6)`,
        }}
        data-aos="fade-up"
      >
        <Image
          src={illustration}
          alt=""
          width={120}
          height={120}
          className={`absolute -top-[60px] filter drop-shadow-[0_0_5px_rgba(255,255,255,0.20)] ${
            reverse ? "ltr:right-0 rtl:left-0" : "ltr:left-0 rtl:right-0"
          }`}
        />

        <h4 className="text-4xl font-bold">{title}</h4>
        <p>{description}</p>
        <Link
          href={`/tracks${link}`}
          className="absolute w-1/2 -bottom-5 inset-x-1/2 -translate-x-1/2 rtl:translate-x-1/2"
        >
          <Button
            className="w-full bg-white hover:bg-[#e6e6e6] font-black text-lg py-6"
            size="lg"
            style={{
              color: from,
            }}
          >
            {t("details")}
          </Button>
        </Link>
      </div>
    </>
  );
};

function Tracks() {
  const t = useTranslations("home.tracks");
  const tracks = t.raw("tracks");
  return (
    <section className="relative flex flex-col gap-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fill-[#202C64] translate-y-1"
      >
        <path
          fillOpacity="1"
          d="M0,160L30,170.7C60,181,120,203,180,229.3C240,256,300,288,360,288C420,288,480,256,540,218.7C600,181,660,139,720,117.3C780,96,840,96,900,96C960,96,1020,96,1080,112C1140,128,1200,160,1260,160C1320,160,1380,128,1410,112L1440,96L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
        ></path>
      </svg>

      <div className="min-h-screen py-20 flex flex-col items-center justify-center max-lg:gap-20 text-white w-screen bg-gradient-to-b from-[#202C64] to-[#211D55]/60">
        <h3 className="text-center mb-10">{t("title")}</h3>
        {tracks.map((track, index) => (
          <TrackContainer
            key={index}
            reverse={index % 2 !== 0}
            title={track.title}
            description={track.description}
            illustration={track.illustration}
            from={track.from}
            link={track.link}
          />
        ))}
      </div>

      <svg
        className="w-full fill-[#211D55]/60"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fillOpacity="1"
          d="M0,128L48,128C96,128,192,128,288,112C384,96,480,64,576,48C672,32,768,32,864,80C960,128,1056,224,1152,240C1248,256,1344,192,1392,160L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
    </section>
  );
}
function DiamondShape({ cn }) {
  return (
    <div
      className={`w-8 h-8 lg:w-14 lg:h-14 bg-primary rotate-45 flex items-center justify-center z-50 ${cn}`}
    >
      <div className="w-4 h-4 lg:w-7 lg:h-7 bg-white flex items-center justify-center">
        <div className="w-2 h-2 lg:w-3 lg:h-3 bg-primary"></div>
      </div>
    </div>
  );
}
function CardStage({ index, details }) {
  const { title, description, date } = details || {};

  const position = index % 2 === 0 ? "start" : "end";
  return (
    <div className="flex flex-col relative lg:w-[896px]">
      <DiamondShape cn="absolute left-1 lg:left-1/2 rtl:left-auto rtl:right-1 rtl:lg:right-1/2 -translate-x-1/2 rtl:translate-x-1/2" />
      <div
        className={`mt-4 lg:mt-7 p-5 py-7 bg-[#E9F6FE] text-primary border border-white/20 shadow-lg lg:w-md rounded-3xl flex flex-col justify-start items-start ${
          index % 2 === 0 ? "lg:self-start" : "lg:self-end"
        }`}
        data-aos="fade-up"
      >
        <h4 className="text-2xl font-bold mb-2">{title}</h4>
        <p>{description}</p>
        <p dir="ltr">{date}</p>
      </div>
    </div>
  );
}
function Stages() {
  const t = useTranslations("home.stages");
  const stages = t.raw("timeline");
  return (
    <div className="container w-fit max-w-7xl mx-auto p-6 flex flex-col gap-10 py-20">
      <h3 className="text-primary text-center">{t("title")}</h3>
      <div className="relative">
        <div className="absolute lg:left-1/2 transform lg:-translate-x-1/2 border-l-4 border-primary h-full z-40" />
        <div className="flex flex-col h-full justify-center relative w-fit">
          {stages.map((stage, index) => (
            <CardStage index={index} details={stage} key={index} />
          ))}
        </div>
        <DiamondShape cn="absolute left-1 lg:left-1/2 rtl:left-auto rtl:right-1 rtl:lg:right-1/2 -translate-x-1/2 rtl:translate-x-1/2" />
      </div>
    </div>
  );
}
// Prizes & Rules
function AdvantagesAndRules() {
  const t = {
    advantages: useTranslations("home.advantages"),
    rules: useTranslations("home.rules"),
  };
  return (
    <section>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fill-[#202C64] translate-y-1"
      >
        <path
          fillOpacity="1"
          d="M0,288L60,288C120,288,240,288,360,293.3C480,299,600,309,720,288C840,267,960,213,1080,208C1200,203,1320,245,1380,266.7L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>

      <div className="bg-gradient-to-b from-[#202C64] to-[#27A4BD]/80 py-10">
        <h3 className="text-white text-center" data-aos="fade-up">
          {t.advantages("title")}
        </h3>
        <div className="w-fit ml-auto">
          <Image
            src="/images/advantages-vector.svg"
            alt="Advantages"
            width={600}
            height={400}
            className="h-auto w-screen lg:w-[70vw] aspect-auto"
            data-aos="fade-up"
          />
        </div>

        <div id="rules" className="grid place-items-center py-5">
          <div className="flex flex-col gap-4 ">
            <h3 className="text-white text-center" data-aos="fade-up">
              {t.rules("title")}
            </h3>
            <Card className="text-white bg-transparent border-none shadow-none container mx-auto lg:w-3xl">
              <CardContent className="text-white">
                <ol className="flex flex-col gap-5 lg:gap-10 list-decimal text-sm md:text-[20px]">
                  {t.rules.raw("rules_list").map((rule, index) => (
                    <li
                      key={index}
                      data-aos="fade-up"
                      className="border rounded-lg p-4 list-inside bg-gradient-to-br from-[#0EA5E9]/90 to-white/0 bg-white/20 backdrop-blur-xl border-white/30"
                    >
                      {rule}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="fill-[#27A4BD]/80"
      >
        <path
          fillOpacity="1"
          d="M0,224L80,202.7C160,181,320,139,480,154.7C640,171,800,245,960,277.3C1120,309,1280,299,1360,293.3L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        ></path>
      </svg>
    </section>
  );
}
// join community
function Community() {
  const t = useTranslations("home.community");
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-6 container mx-auto gap-4"
      data-aos="fade-up"
    >
      {/* Discord logo */}
      <Image
        src="/images/discord-logo.png"
        alt="Discord Logo"
        width={200}
        height={200}
        className="w-32 sm:w-48 md:w-64 h-auto"
      />

      {/* Description with quotes */}
      <div className="flex items-center justify-center w-full max-w-4xl px-2 md:gap-5 ">
        {/* Left quote */}
        <Image
          src="/images/quote-icon-3d.png"
          alt="Quote"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-16 sm:h-16 rotate-180"
        />

        {/* Text */}
        <p className="text-lg sm:text-2xl md:text-3xl text-center font-bold px-8">
          {t("description")}
        </p>

        {/* Right quote */}
        <Image
          src="/images/quote-icon-3d.png"
          alt="Quote"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-16 sm:h-16"
        />
      </div>

      {/* Button */}
      <a
        href="https://discord.gg/zwybBSrS"
        target="_blank"
        rel="noopener noreferrer"
        className="w-1/2 lg:w-1/4"
      >
        <Button
          size="lg"
          className="w-full py-3 md:py-6 text-lg md:text-2xl font-bold"
        >
          {t("cta")}
        </Button>
      </a>
    </div>
  );
}

// Sponsors, Credits for SponsorsCarousel: chatGPT and ClaudeAI
function Sponsors() {
  const t = useTranslations("home.sponsors");

  const strategicSponsors = {
    id: 1,
    logo: "/images/The-Ministry-of-Transport-and-Logistic-Services-logo.svg",
    name: "logisticMinistry",
  };
  const otherSponsors = [
    {
      id: 1,
      logo: "/images/partner-kau.png",
      name: "KAU",
    },
    {
      id: 2,
      logo: "/images/partner-manufacturing.jpg",
      name: "manufacturing",
    },
  ];

  return (
    <div className="flex flex-col gap-5 justify-center items-center min-h-screen py-5">
      <p className="text-2xl text-cyan-primary" data-aos="fade-up">
        {t("strategic")}
      </p>
      <Image
        src={strategicSponsors.logo}
        alt={strategicSponsors.name}
        width={300}
        height={150}
        className="w-1/2 object-contain text-center grid place-items-center"
        data-aos="fade-up"
      />
      <h3
        className="text-primary tracking-tight text-center mt-5"
        data-aos="fade-up"
      >
        {t("title")}
      </h3>
      <SponsorsCarousel partners={otherSponsors} />
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
    <div
      className="relative w-full container mx-auto"
      dir="ltr"
      data-aos="fade-up"
    >
      {/* Carousel container */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex-[0_0_100%] flex items-center justify-center p-8 h-fit"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
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
        {partners.map((_, index) => (
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
