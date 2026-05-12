import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import '../i18n/config'
import MobileGate from '../components/MobileGate'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Selim Koç — Full Stack Developer',
      },
      {
        name: 'description',
        content: 'Full Stack Developer specializing in Next.js, scalable web apps, and AI-driven systems.',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/sk.png',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* Early inline script to set wallpaper from localStorage before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var key = localStorage.getItem('portfolio:wallpaper') || 'default';
                var MAP = {
                  default: '/wallpapers/abstract-swirls.webp',
                  'desktop-bg': '/wallpapers/swirls.webp',
                  cat: '/wallpapers/railroad-cat.webp',
                  windowsXp: '/wallpapers/windows-xp.webp',
                  trippy: '/wallpapers/cosmic-purple.webp',
                  dark: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  ocean: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  forest: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
                };
                var val = MAP[key] || MAP.default;
                var css = String(val).startsWith('linear-gradient(') ? val : 'url(' + val + ')';
                document.documentElement.style.setProperty('--wallpaper-image', css);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="h-screen w-full flex flex-col">
        <MobileGate />
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="fixed bottom-3 right-4 z-50 text-xs text-white/40 font-medium tracking-wide drop-shadow-md">
          &copy; Selim Koç
        </footer>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-4">
        <p className="text-sm uppercase tracking-widest text-white/60">404</p>
        <h1 className="text-2xl font-semibold">Sayfa bulunamadı</h1>
        <p className="text-white/70 text-sm">
          Lütfen adresi kontrol edin veya dock üzerinden bir uygulama açın.
        </p>
      </div>
    </div>
  )
}
