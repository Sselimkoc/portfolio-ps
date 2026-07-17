import { useEffect } from 'react'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { SpeedInsights } from '@vercel/speed-insights/react'

import appCss from '../styles.css?url'
import i18n from '../i18n/config'
import MobileGate from '../components/MobileGate'
import { SITE_URL, personJsonLd, seoMeta } from '../lib/seo'

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
      ...seoMeta(),
    ],
    links: [
      {
        rel: 'canonical',
        href: SITE_URL,
      },
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
  // Keep <html lang> in sync with the active i18n language
  useEffect(() => {
    document.documentElement.lang = i18n.language
    const onLanguageChanged = (lng: string) => {
      document.documentElement.lang = lng
    }
    i18n.on('languageChanged', onLanguageChanged)
    return () => {
      i18n.off('languageChanged', onLanguageChanged)
    }
  }, [])

  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd }}
        />
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
        {/* Desktop-only: hidden on mobile so the heavy canvas UI doesn't render/paint on small screens */}
        <main className="hidden lg:flex flex-1 flex-col">{children}</main>
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
        <SpeedInsights />
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
