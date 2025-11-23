import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import AOSInit from "@/components/AOSInit";
import "aos/dist/aos.css";

export const metadata = {
  title: "Protothon | هاكثون النمذجة",
  description:
    "هاكاثون النمذجة هو هاكاثون نمذجة يجمع المبتكرين والمصممين والمبرمجين لصناعة نماذج أولية لمشاريع واقعية ضمن أربعة مسارات: الصحة، الأمن والسلامة، إعادة تصميم الأشياء، و النقل والمركبات",
  openGraph: {
    title: "Protothon | هاكثون النمذجة",
    description:
      "هاكاثون النمذجة هو هاكاثون نمذجة يجمع المبتكرين والمصممين والمبرمجين لصناعة نماذج أولية لمشاريع واقعية ضمن أربعة مسارات: الصحة، الأمن والسلامة، إعادة تصميم الأشياء، و النقل والمركبات",
    url: "https://your-domain.com",
    siteName: "Protothon",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Protothon Preview",
      },
    ],
    locale: "ar",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Protothon | بروتوثون",
    description:
      "هاكاثون النمذجة هو هاكاثون نمذجة يجمع المبتكرين والمصممين والمبرمجين لصناعة نماذج أولية لمشاريع واقعية ضمن أربعة مسارات: الصحة، الأمن والسلامة، إعادة تصميم الأشياء، و النقل والمركبات",
    images: ["/preview.png"],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Rajdhani:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased w-screen overflow-x-hidden`}>
        <AOSInit />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
