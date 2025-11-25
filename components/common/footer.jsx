"use client";

import React from 'react'
import { useTranslations } from 'use-intl'
import { H3 } from '../shadcn/typography-h3';
import { Instagram, Linkedin, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

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
            router.push(`/?#${id}`);
        } else {
            // If already on home page, just scroll
            const element = document.getElementById(id);
            element?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const footerLinks = [
        { key: "about_hackathon", href: "#about", onClick: () => scrollToSection("about") },
        { key: "faq", href: "#faqs", onClick: () => scrollToSection("faqs") },
        { key: "rules", href: "#rules", onClick: () => scrollToSection("rules") },
        { key: "apply", href: "/apply" },
        { key: "become_partner", href: "mailto:protothon.kau@gmail.comn" },
    ];

    const trackLinks = [
        { href: "/tracks/health", label: "health" },
        { href: "/tracks/safety", label: "safety" },
        { href: "/tracks/innovation", label: "innovation" },
        { href: "/tracks/vehicle", label: "vehicle" },
    ];
    return (
        <footer>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className='translate-y-1'>
                <path fill="#24234C" fillOpacity="1" d="M0,16L60,21.3C120,27,240,37,360,42.7C480,48,600,48,720,37.3C840,27,960,5,1080,0C1200,-5,1320,5,1380,10.7L1440,16L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"></path>
            </svg>
            <div id="footer" className='flex flex-col items-center md:items-start md:text-start text-center gap-6 bg-gradient-to-b from-[#24234C] to-[#145474] pb-4 px-3 mx-auto text-white'>
                <div className='mx-auto w-fit text-center py-5'>
                    <p className='text-2xl lg:text-4xl mb-2'>{t.footer('contactus')}</p>
                    <a href='mailto:protothon.sa@gmail.com' className="hover:underline text-3xl lg:text-7xl " target="_blank" rel="noopener noreferrer">
                        Protothon.sa@gmail.com
                    </a>
                </div>
                <div className='flex gap-4 items-center space-x-2'>
                    <Image
                        src="/protothon-logo-white.svg"
                        alt="protothon logo purple"
                        width={150}
                        height={0}
                        className="w-16 lg:w-[150px] h-auto"
                        priority
                    />
                </div>
                <div className='flex flex-col md:grid grid-cols-2 max-md:gap-10 justify-evenly w-full'>
                    <div>
                        <h4 className='text-2xl font-semibold mb-2'>{t.shared("protothon")}</h4>
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
                                    ) : link.href.startsWith('/') ? (
                                        <Link href={link.href} className="hover:underline">
                                            {t.footer(link.key)}
                                        </Link>
                                    ) : (
                                        <a href={link.href} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                            {t.footer(link.key)}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Track Links */}
                    <div className="mt-4">
                        <h4 className="text-2xl font-semibold mb-2">{t.header('tracks')}</h4>
                        <ul className="flex flex-col gap-2 font-normal px-2">
                            {trackLinks.map((track) => (
                                <li key={track.href}>
                                    <Link
                                        href={track.href}
                                        className="hover:underline"
                                    >
                                        {t.header(`tracksList.${track.label}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='flex flex-col justify-between items-center md:flex-row gap-2'>
                    <div className='grid grid-cols-4 gap-3'>
                        <a href="https://www.linkedin.com/company/protothon-kau" target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-sm p-1 hover:bg-gray-200"
                        >
                            <Linkedin className="text-primary w-5 h-5" />
                        </a>
                        <a href="https://www.instagram.com/protothon_sa" target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-sm p-1 hover:bg-gray-200"
                        >
                            <Instagram className="text-primary w-5 h-5" />
                        </a>
                        <a href="https://www.tiktok.com/@protothon" target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-sm p-1 hover:bg-gray-200 text-primary fill-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="size-5" viewBox="0 0 16 16">
                                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                            </svg>
                        </a>
                        <a href="https://x.com/protothon_sa" target="_blank" rel="noopener noreferrer"
                            className="bg-white rounded-sm p-1 hover:bg-gray-200 text-primary fill-primary"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="size-5" viewBox="0 0 16 16">
                                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                            </svg>
                        </a>

                    </div>
                </div>
                <p className="flex gap-2 text-sm text-center mx-auto" dir='ltr'>
                    <p className='opacity-50'>Created with ❤️ by</p>
                    <a
                        href="https://abdullh.tech"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-200 opacity-50 hover:opacity-100 transition-colors border-b flex items-center gap-1"
                    >
                        abdullh.tech
                        <LinkIcon className='size-3' />
                    </a>
                </p>
            </div >
        </footer>
    )
}
