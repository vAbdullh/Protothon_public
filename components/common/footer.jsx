"use client";

import React from 'react'
import { useTranslations } from 'use-intl'
import { H3 } from '../shadcn/typography-h3';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function footer() {
    const pathname = usePathname();
    const router = useRouter();
    const t = {
        shared: useTranslations('shared'),
        footer: useTranslations('footer'),
        header: useTranslations('header')
    };

    const scrollToSection = (id) => {
        if (pathname !== "/") {
            // Navigate to home page with hash
            router.push(`/#${id}`);
        } else {
            // If already on home page, just scroll
            const element = document.getElementById(id);
            element?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const footerLinks = [
        { key: "about_hackathon", href: "#about", onClick: () => scrollToSection("about") },
        { key: "faq", href: "#" },
    ];

    const trackLinks = [
        { href: "/tracks/health", label: "health" },
        { href: "/tracks/safety", label: "safety" },
        { href: "/tracks/innovation", label: "innovation" },
        { href: "/tracks/vehicle", label: "vehicle" },
    ];
    return (
        <div id="footer" className='flex flex-col gap-6 bg-gradient-to-b from-[#0F0723] to-[#3B1C89] py-8 px-3 mx-auto text-white'>
            <H3>{t.shared("protothon")}</H3>
            <ul className="flex flex-col gap-2 font-normal">
                {footerLinks.map((link) => (
                    <li key={link.key}>
                        {link.onClick ? (
                            <button 
                                onClick={link.onClick}
                                className="hover:underline text-left"
                            >
                                {t.footer(link.key)}
                            </button>
                        ) : (
                            <a href={link.href} className="hover:underline">
                                {t.footer(link.key)}
                            </a>
                        )}
                    </li>
                ))}
            </ul>

            {/* Track Links */}
            <div className="mt-4">
                <h4 className="font-semibold mb-2">Tracks</h4>
                <ul className="flex flex-col gap-2 font-normal">
                    {trackLinks.map((track) => (
                        <li key={track.href}>
                            <a 
                                href={track.href}
                                className="hover:underline"
                            >
                                {t.header(`tracksList.${track.label}`)}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex flex-col justify-between items-center md:flex-row gap-2'>
                <div className='grid grid-cols-2 gap-3'>
                    <a href="https://www.linkedin.com/company/protothon-kau" target="_blank" rel="noopener noreferrer"
                        className="bg-white rounded-sm p-1 hover:bg-gray-200"
                    >
                        <Linkedin className="text-primary w-5 h-5" />
                    </a>
                    <a href="https://x.com/protothon_sa" target="_blank" rel="noopener noreferrer"
                        className="bg-white rounded-sm p-1 hover:bg-gray-200 text-primary fill-primary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="size-5" viewBox="0 0 16 16">
                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                        </svg>
                    </a>

                </div>
                <div className='flex gap-4 items-center space-x-2'>
                    <Image
                        src="/protothon-logo-purple.png"
                        alt="protothon logo purple"
                        width={150}
                        height={0}
                        className="w-16 lg:w-[150px] h-auto invert brightness-0"
                        priority
                    />
                </div>
            </div>
        </div >
    )
}
