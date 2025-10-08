"use client";

import { use, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/shadcn/card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
// credits: V0 and chatGPT did some updates
interface CountdownProps {
  targetDate: Date | string | number;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({ targetDate, className }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const t = useTranslations("countdown");

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      className={cn(
        "grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 w-full",
        className
      )}
      dir="ltr"
    >
      <CountdownCard value={timeLeft.days} label={t("days")} />
      <CountdownCard value={timeLeft.hours} label={t("hours")} />
      <CountdownCard value={timeLeft.minutes} label={t("minutes")} />
      <CountdownCard value={timeLeft.seconds} label={t("seconds")} />
    </div>
  );
}

interface CountdownCardProps {
  value: number;
  label: string;
}

function CountdownCard({ value, label }: CountdownCardProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setAnimate(true);
      const timeout = setTimeout(() => {
        setAnimate(false);
        setPrevValue(value);
      }, 300); // duration matches your CSS transition
      return () => clearTimeout(timeout);
    }
  }, [value, prevValue]);
  return (
    <Card className="overflow-hidden bg-gradient-to-t from-[#99E9FE] to-[#E9F6FE] text-[#3B1C89] sm:text-xl font-black">
      <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative h-10 w-full sm:h-16 md:h-20 overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums sm:text-5xl md:text-6xl transition-transform duration-1000 opacity-0",
              animate ? "opacity-0" : "translate-y-0 opacity-100"
            )}
          >
            {String(prevValue).padStart(2, "0")}
          </div>
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center text-2xl font-bold tabular-nums sm:text-5xl md:text-6xl transition-transform duration-300",
              animate
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            )}
          >
            {String(value).padStart(2, "0")}
          </div>
        </div>
        <p className="mt-1  uppercase tracking-wider">{label}</p>
      </CardContent>
    </Card>
  );
}
