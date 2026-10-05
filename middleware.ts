import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n';

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals and any file with an extension (images, robots.txt, sitemap.xml…)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
