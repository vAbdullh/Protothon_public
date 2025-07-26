import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware({
  ...routing,
  localeDetection: true,
  // Use stored preference if available, otherwise use browser language
  localePrefix: 'as-needed',
  defaultLocale: 'en',
  // Check for stored locale in cookies
  getLocale: (request) => {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookieLocale && routing.locales.includes(cookieLocale)) {
      return cookieLocale;
    }
    return null; // Fall back to browser detection
  }
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
