export const SITE_URL = 'https://selimkoc.dev'
export const SITE_TITLE = 'Selim Koç — Full Stack Developer'
export const SITE_DESCRIPTION =
  'Full Stack Developer specializing in Next.js, scalable web apps, and AI-driven systems.'
export const OG_IMAGE = `${SITE_URL}/og.jpg`
export const GITHUB_URL = 'https://github.com/Sselimkoc'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/sselimkoc462/'

export function seoMeta() {
  return [
    { title: SITE_TITLE },
    { name: 'description', content: SITE_DESCRIPTION },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:title', content: SITE_TITLE },
    { property: 'og:description', content: SITE_DESCRIPTION },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:locale', content: 'tr_TR' },
    { property: 'og:locale:alternate', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: SITE_TITLE },
    { name: 'twitter:description', content: SITE_DESCRIPTION },
    { name: 'twitter:image', content: OG_IMAGE },
  ]
}

export const personJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Selim Koç',
  url: SITE_URL,
  image: `${SITE_URL}/skpp.jpeg`,
  jobTitle: 'Full Stack Developer',
  sameAs: [GITHUB_URL, LINKEDIN_URL],
})
