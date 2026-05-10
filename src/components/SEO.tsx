import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}

const SITE_URL = 'https://iti.faku.pro'
const DEFAULT_OG = 'https://iti.faku.pro/assets/Logo_FP.png'

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG,
  ogType = 'website',
  noIndex = false,
}: SEOProps) {
  const fullTitle = `${title} — Facundo Presa | ITI`
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullCanonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Facundo Presa - ITI" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  )
}
