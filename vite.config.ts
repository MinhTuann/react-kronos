import { promises as fs } from 'node:fs'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

type PublicSeoSettings = {
  site_name?: string
  site_name_en?: string
  default_title?: string
  default_title_en?: string
  default_description?: string
  default_description_en?: string
  default_og_image_url?: string
  site_url?: string
  organization_name?: string
  organization_name_en?: string
  logo_url?: string
  pages?: Partial<Record<PublicSeoPageKey, PublicSeoPageEntry>>
}

type PublicSeoPageKey = 'home' | 'collections' | 'about-us' | 'contact-us' | 'news-events'

type PublicSeoPageEntry = {
  meta_title?: string
  meta_title_en?: string
  meta_description?: string
  meta_description_en?: string
  og_image_url?: string
  canonical_path?: string
  noindex?: boolean
}

type PublicArticle = {
  id?: string
  title?: string
  title_en?: string
  slug?: string
  category?: string
  category_en?: string
  image_url?: string
  summary?: string
  summary_en?: string
  content?: string
  content_en?: string
  seo_title?: string
  seo_title_en?: string
  seo_description?: string
  seo_description_en?: string
  seo_image_url?: string
  canonical_url?: string
  noindex?: boolean
  date?: string
  created_at?: string
}

type PublicWatch = {
  id: string | number
  brand?: string
  collection?: string
  name?: string
  ref?: string
  price?: number
  image?: string
  description?: string
  description_en?: string
  seo_title?: string
  seo_title_en?: string
  seo_description?: string
  seo_description_en?: string
  seo_image_url?: string
  canonical_url?: string
  noindex?: boolean
}

type PaginatedResponse<T> = {
  data: T[]
  meta?: {
    hasNextPage?: boolean
    lastCursor?: string | null
  }
}

type SitemapEntry = {
  loc: string
  changefreq?: 'daily' | 'weekly' | 'monthly'
  priority?: string
  lastmod?: string
}

type SeoMeta = {
  lang: 'en' | 'vi'
  title: string
  description: string
  canonicalUrl: string
  image?: string
  type: 'website' | 'article' | 'product'
  noindex?: boolean
  structuredData?: Array<Record<string, unknown>>
}

type PrerenderedPage = {
  path: string
  meta: SeoMeta
  body: string
}

type StaticRoute = Omit<SitemapEntry, 'loc'> & {
  path: string
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/collections', changefreq: 'daily', priority: '0.9' },
  { path: '/about-us', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact-us', changefreq: 'monthly', priority: '0.5' },
  { path: '/news-events', changefreq: 'weekly', priority: '0.8' },
]

const DEFAULT_DEV_SITE_URL = 'http://localhost:5175'
const DEFAULT_UAT_SITE_URL = 'https://kronos-storefront-uat.web.app'
const DEFAULT_PROD_SITE_URL = 'https://thekronos.vn'
const SITEMAP_PAGE_SIZE = 100
const PRERENDER_SNIPPET_LENGTH = 420

const normalizeSiteUrl = (value?: string | null): string => {
  if (!value) return ''

  try {
    const normalized = new URL(value)
    normalized.hash = ''
    normalized.search = ''
    return normalized.toString().replace(/\/$/, '')
  } catch {
    return ''
  }
}

const normalizeAbsoluteUrl = (value?: string | null): string => {
  if (!value) return ''

  try {
    const normalized = new URL(value)
    normalized.hash = ''
    return normalized.toString()
  } catch {
    return ''
  }
}

const readLocalizedValue = (
  lang: 'en' | 'vi',
  primary?: string | null,
  english?: string | null,
) => (lang === 'en' ? english || primary || '' : primary || english || '')

const toAbsoluteUrl = (siteUrl: string, pathname: string): string => {
  return new URL(pathname, `${siteUrl}/`).toString()
}

const escapeHtml = (value: string): string => (
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
)

const escapeXml = (value: string): string => (
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
)

const normalizeLastmod = (value?: string): string | undefined => {
  if (!value) return undefined

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

const stripHtml = (value: string): string => (
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
)

const trimDescription = (value: string, maxLength = 160): string => {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength - 3).trim()}...`
}

const excerpt = (value: string, maxLength = PRERENDER_SNIPPET_LENGTH): string => {
  const plain = stripHtml(value)
  return trimDescription(plain, maxLength)
}

const createBreadcrumbJsonLd = (siteUrl: string, items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(siteUrl, item.path),
  })),
})

const createOrganizationJsonLd = (
  settings: PublicSeoSettings | null,
  lang: 'en' | 'vi',
  siteUrl: string,
) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: readLocalizedValue(lang, settings?.organization_name, settings?.organization_name_en)
    || readLocalizedValue(lang, settings?.site_name, settings?.site_name_en)
    || 'Kronos Luxury Timepieces',
  url: siteUrl,
  logo: normalizeAbsoluteUrl(settings?.logo_url) || normalizeAbsoluteUrl(settings?.default_og_image_url) || undefined,
})

const applySeoTemplate = (template: string, meta: SeoMeta): string => {
  const seoBlock = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonicalUrl)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonicalUrl)}" />`,
    meta.image ? `<meta property="og:image" content="${escapeHtml(meta.image)}" />` : '',
    `<meta name="twitter:card" content="${meta.image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    meta.image ? `<meta name="twitter:image" content="${escapeHtml(meta.image)}" />` : '',
    meta.structuredData?.length
      ? `<script type="application/ld+json" data-kronos-seo="json-ld">${JSON.stringify(meta.structuredData)}</script>`
      : '',
  ].filter(Boolean).join('\n    ')

  const withoutSeo = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+(?:name|property)="(?:description|robots|twitter:[^"]+|og:[^"]+)"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<script[^>]*data-kronos-seo="json-ld"[^>]*>[\s\S]*?<\/script>\s*/gi, '')
    .replace(/<html lang="[^"]*">/i, `<html lang="${meta.lang}">`)

  return withoutSeo.replace('</head>', `    ${seoBlock}\n  </head>`)
}

const renderPageHtml = (template: string, page: PrerenderedPage): string => {
  const pageTemplate = applySeoTemplate(template, page.meta)
  return pageTemplate.replace('<div id="root"></div>', `<div id="root">${page.body}</div>`)
}

const writePrerenderedPage = async (outputDir: string, page: PrerenderedPage, html: string, isHomePage = false) => {
  const targetDir = isHomePage
    ? outputDir
    : path.resolve(outputDir, page.path.replace(/^\/+/, ''))

  await fs.mkdir(targetDir, { recursive: true })
  await fs.writeFile(path.resolve(targetDir, 'index.html'), html, 'utf8')
}

const buildSeoMeta = ({
  settings,
  siteUrl,
  pageKey,
  lang = 'en',
  title,
  description,
  image,
  canonicalPath,
  canonicalUrl,
  noindex,
  type,
  structuredData,
}: {
  settings: PublicSeoSettings | null
  siteUrl: string
  pageKey?: PublicSeoPageKey
  lang?: 'en' | 'vi'
  title?: string
  description?: string
  image?: string
  canonicalPath?: string
  canonicalUrl?: string
  noindex?: boolean
  type: 'website' | 'article' | 'product'
  structuredData?: Array<Record<string, unknown>>
}): SeoMeta => {
  const pageSettings = pageKey ? settings?.pages?.[pageKey] : undefined
  const siteName = readLocalizedValue(lang, settings?.site_name, settings?.site_name_en) || 'Kronos Luxury Timepieces'
  const defaultTitle = readLocalizedValue(lang, settings?.default_title, settings?.default_title_en) || siteName
  const defaultDescription = readLocalizedValue(lang, settings?.default_description, settings?.default_description_en) || siteName
  const pageTitle = pageKey ? readLocalizedValue(lang, pageSettings?.meta_title, pageSettings?.meta_title_en) : ''
  const pageDescription = pageKey ? readLocalizedValue(lang, pageSettings?.meta_description, pageSettings?.meta_description_en) : ''
  const titleBase = title || pageTitle || defaultTitle
  const resolvedTitle = titleBase === siteName ? titleBase : `${titleBase} | ${siteName}`

  return {
    lang,
    title: resolvedTitle,
    description: trimDescription(description || pageDescription || defaultDescription),
    canonicalUrl: canonicalUrl || toAbsoluteUrl(siteUrl, canonicalPath || pageSettings?.canonical_path || '/'),
    image: normalizeAbsoluteUrl(image) || normalizeAbsoluteUrl(pageSettings?.og_image_url) || normalizeAbsoluteUrl(settings?.default_og_image_url) || undefined,
    noindex: Boolean(noindex ?? pageSettings?.noindex),
    type,
    structuredData,
  }
}

const renderStaticPageBody = (title: string, description: string, sections: string[]): string => `
  <main style="font-family: Georgia, serif; max-width: 860px; margin: 0 auto; padding: 72px 24px 96px; color: #1f2933; line-height: 1.7;">
    <p style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #8b7355; margin: 0 0 18px;">Kronos Luxury Timepieces</p>
    <h1 style="font-size: 48px; line-height: 1.1; margin: 0 0 20px;">${escapeHtml(title)}</h1>
    <p style="font-size: 18px; color: #475569; margin: 0 0 32px;">${escapeHtml(description)}</p>
    ${sections.map((section) => `<p style="margin: 0 0 18px; color: #334155;">${escapeHtml(section)}</p>`).join('')}
  </main>
`

const renderArticleBody = (article: PublicArticle) => {
  const title = article.title_en || article.title || 'News & Events'
  const summary = excerpt(article.summary_en || article.summary || article.content_en || article.content || '')
  const body = excerpt(article.content_en || article.content || article.summary_en || article.summary || '', 900)

  return `
    <article style="font-family: Georgia, serif; max-width: 860px; margin: 0 auto; padding: 72px 24px 96px; color: #1f2933; line-height: 1.7;">
      <p style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #8b7355; margin: 0 0 18px;">News &amp; Events</p>
      <h1 style="font-size: 48px; line-height: 1.1; margin: 0 0 16px;">${escapeHtml(title)}</h1>
      ${article.date ? `<p style="color: #64748b; margin: 0 0 20px;">${escapeHtml(article.date)}</p>` : ''}
      ${article.image_url ? `<img src="${escapeHtml(article.image_url)}" alt="${escapeHtml(title)}" style="width: 100%; height: auto; display: block; border-radius: 18px; margin: 0 0 28px;" />` : ''}
      ${summary ? `<p style="font-size: 20px; color: #334155; margin: 0 0 24px;">${escapeHtml(summary)}</p>` : ''}
      ${body ? `<p style="margin: 0; color: #475569;">${escapeHtml(body)}</p>` : ''}
    </article>
  `
}

const renderWatchBody = (watch: PublicWatch) => {
  const title = watch.name || 'Luxury Timepiece'
  const description = excerpt(watch.description_en || watch.description || '')
  const facts = [
    watch.brand ? `Brand: ${watch.brand}` : '',
    watch.collection ? `Collection: ${watch.collection}` : '',
    watch.ref ? `Reference: ${watch.ref}` : '',
    typeof watch.price === 'number' ? `Price: ${watch.price.toLocaleString('en-US')} VND` : '',
  ].filter(Boolean)

  return `
    <article style="font-family: Georgia, serif; max-width: 860px; margin: 0 auto; padding: 72px 24px 96px; color: #1f2933; line-height: 1.7;">
      <p style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #8b7355; margin: 0 0 18px;">Collections</p>
      <h1 style="font-size: 48px; line-height: 1.1; margin: 0 0 16px;">${escapeHtml(title)}</h1>
      ${watch.image ? `<img src="${escapeHtml(watch.image)}" alt="${escapeHtml(title)}" style="width: 100%; height: auto; display: block; border-radius: 18px; margin: 0 0 28px;" />` : ''}
      ${facts.length ? `<ul style="padding-left: 20px; margin: 0 0 24px; color: #334155;">${facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join('')}</ul>` : ''}
      ${description ? `<p style="margin: 0; color: #475569;">${escapeHtml(description)}</p>` : ''}
    </article>
  `
}

const createSitemapXml = (entries: SitemapEntry[]): string => {
  const urls = entries.map((entry) => {
    const parts = [`<loc>${escapeXml(entry.loc)}</loc>`]

    if (entry.lastmod) parts.push(`<lastmod>${entry.lastmod}</lastmod>`)
    if (entry.changefreq) parts.push(`<changefreq>${entry.changefreq}</changefreq>`)
    if (entry.priority) parts.push(`<priority>${entry.priority}</priority>`)

    return `  <url>\n    ${parts.join('\n    ')}\n  </url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

const createRobotsTxt = (siteUrl: string): string => {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /*?',
  ]

  if (siteUrl) {
    lines.push(`Sitemap: ${siteUrl}/sitemap.xml`)
  }

  lines.push('')
  return lines.join('\n')
}

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.warn(`[seo] Request failed (${response.status}) for ${url}`)
      return null
    }

    return await response.json() as T
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.warn(`[seo] Request failed for ${url}: ${message}`)
    return null
  }
}

const fetchPaginatedCollection = async <T>(apiUrl: string, resource: string): Promise<T[]> => {
  const collected: T[] = []
  let cursor: string | null | undefined

  while (true) {
    const requestUrl = new URL(resource, `${apiUrl}/`)
    requestUrl.searchParams.set('limit', String(SITEMAP_PAGE_SIZE))

    if (cursor) {
      requestUrl.searchParams.set('cursor', cursor)
    }

    const payload = await fetchJson<PaginatedResponse<T>>(requestUrl.toString())

    if (!payload) break

    collected.push(...(payload.data ?? []))

    if (!payload.meta?.hasNextPage || !payload.meta.lastCursor) {
      break
    }

    cursor = payload.meta.lastCursor
  }

  return collected
}

const fetchWatchDetails = async (apiUrl: string, watches: PublicWatch[]): Promise<PublicWatch[]> => {
  const details = await Promise.all(
    watches.map(async (watch) => {
      const detail = await fetchJson<PublicWatch>(`${apiUrl}/watches/${watch.id}`)
      return detail ? { ...watch, ...detail } : watch
    }),
  )

  return details
}

const resolveHostingSiteUrl = async (rootDir: string, mode: string): Promise<string> => {
  if (mode === 'dev') {
    return DEFAULT_DEV_SITE_URL
  }

  if (mode === 'uat') {
    return DEFAULT_UAT_SITE_URL
  }

  if (mode === 'prod') {
    return DEFAULT_PROD_SITE_URL
  }

  try {
    const raw = await fs.readFile(path.resolve(rootDir, '.firebaserc'), 'utf8')
    const config = JSON.parse(raw) as {
      projects?: Record<string, string>
      targets?: Record<string, { hosting?: Record<string, string[]> }>
    }

    const projectId = config.projects?.[mode]
    const hostingSite = projectId
      ? config.targets?.[projectId]?.hosting?.storefront?.[0]
      : undefined

    return hostingSite ? `https://${hostingSite}.web.app` : ''
  } catch (error) {
    console.warn('[seo] Unable to resolve Firebase Hosting site from .firebaserc', error)
    return ''
  }
}

const createSeoAssetsPlugin = (mode: string): Plugin => {
  let rootDir = process.cwd()
  let outputDir = path.resolve(rootDir, 'dist')

  return {
    name: 'seo-assets',
    apply: 'build',
    configResolved(config) {
      rootDir = config.root
      outputDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const env = loadEnv(mode, rootDir, '')
      const apiUrl = env.VITE_API_URL?.replace(/\/$/, '')
      const indexTemplate = await fs.readFile(path.resolve(outputDir, 'index.html'), 'utf8')

      const seoSettings = apiUrl
        ? await fetchJson<PublicSeoSettings>(`${apiUrl}/seo`)
        : null
      const siteUrl =
        normalizeSiteUrl(env.VITE_SITE_URL)
        || normalizeSiteUrl(seoSettings?.site_url)
        || await resolveHostingSiteUrl(rootDir, mode)

      if (!siteUrl) {
        console.warn('[seo] No site URL configured. Falling back to localhost sitemap entries.')
      }

      const resolvedSiteUrl = siteUrl || DEFAULT_DEV_SITE_URL
      const buildTimestamp = new Date().toISOString()

      const staticEntries: SitemapEntry[] = STATIC_ROUTES.map((route) => ({
        loc: toAbsoluteUrl(resolvedSiteUrl, route.path),
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: buildTimestamp,
      }))

      const [articles, watches] = await Promise.all([
        apiUrl ? fetchPaginatedCollection<PublicArticle>(apiUrl, 'articles') : Promise.resolve<PublicArticle[]>([]),
        apiUrl ? fetchPaginatedCollection<PublicWatch>(apiUrl, 'watches') : Promise.resolve<PublicWatch[]>([]),
      ])
      const watchDetails = apiUrl
        ? await fetchWatchDetails(apiUrl, watches)
        : watches

      const articleEntries: SitemapEntry[] = articles
        .filter((article) => article.slug && !article.noindex)
        .map((article) => ({
          loc: normalizeAbsoluteUrl(article.canonical_url) || toAbsoluteUrl(resolvedSiteUrl, `/news-events/${article.slug}`),
          changefreq: 'weekly',
          priority: '0.7',
          lastmod: normalizeLastmod(article.created_at) || buildTimestamp,
        }))

      const watchEntries: SitemapEntry[] = watchDetails
        .filter((watch) => watch.id !== undefined && watch.id !== null && !watch.noindex)
        .map((watch) => ({
          loc: normalizeAbsoluteUrl(watch.canonical_url) || toAbsoluteUrl(resolvedSiteUrl, `/watch/${watch.id}`),
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: buildTimestamp,
        }))

      const uniqueEntries = [...staticEntries, ...articleEntries, ...watchEntries].filter((entry, index, all) => {
        return all.findIndex((candidate) => candidate.loc === entry.loc) === index
      })

      await fs.mkdir(outputDir, { recursive: true })
      await Promise.all([
        fs.writeFile(path.resolve(outputDir, 'sitemap.xml'), createSitemapXml(uniqueEntries), 'utf8'),
        fs.writeFile(path.resolve(outputDir, 'robots.txt'), createRobotsTxt(resolvedSiteUrl), 'utf8'),
      ])

      const staticPages: PrerenderedPage[] = [
        {
          path: '/',
          meta: buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            pageKey: 'home',
            title: readLocalizedValue('en', seoSettings?.default_title, seoSettings?.default_title_en)
              || readLocalizedValue('en', seoSettings?.site_name, seoSettings?.site_name_en)
              || 'Kronos Luxury Timepieces',
            description: readLocalizedValue('en', seoSettings?.default_description, seoSettings?.default_description_en)
              || 'Discover rare luxury watches, curated collections, and editorial stories from Kronos Luxury Timepieces.',
            type: 'website',
            structuredData: [createOrganizationJsonLd(seoSettings, 'en', resolvedSiteUrl)],
          }),
          body: renderStaticPageBody(
            'Kronos Luxury Timepieces',
            readLocalizedValue('en', seoSettings?.default_description, seoSettings?.default_description_en)
              || 'Discover rare luxury watches, curated collections, and editorial stories from Kronos Luxury Timepieces.',
            [
              'Explore collectible watches, boutique guidance, and editorial stories crafted for modern collectors.',
              'Discover the collections page for current inventory, the news page for editorial updates, and boutique pages for concierge support.',
            ],
          ),
        },
        {
          path: '/collections',
          meta: buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            pageKey: 'collections',
            title: 'Collections',
            description: readLocalizedValue('en', seoSettings?.pages?.collections?.meta_description, seoSettings?.pages?.collections?.meta_description_en)
              || 'Browse the Kronos collection of rare and contemporary luxury watches.',
            canonicalPath: '/collections',
            type: 'website',
            structuredData: [createBreadcrumbJsonLd(resolvedSiteUrl, [
              { name: 'Home', path: '/' },
              { name: 'Collections', path: '/collections' },
            ])],
          }),
          body: renderStaticPageBody(
            'Collections',
            readLocalizedValue('en', seoSettings?.pages?.collections?.meta_description, seoSettings?.pages?.collections?.meta_description_en)
              || 'Browse the Kronos collection of rare and contemporary luxury watches.',
            [
              'View active inventory from leading maisons, compare references, and move into each watch detail page for specifications and availability.',
            ],
          ),
        },
        {
          path: '/about-us',
          meta: buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            pageKey: 'about-us',
            title: 'About Kronos',
            description: readLocalizedValue('en', seoSettings?.pages?.['about-us']?.meta_description, seoSettings?.pages?.['about-us']?.meta_description_en)
              || 'Learn about the Kronos boutique, our philosophy, and our focus on rare luxury timepieces.',
            canonicalPath: '/about-us',
            type: 'website',
            structuredData: [createBreadcrumbJsonLd(resolvedSiteUrl, [
              { name: 'Home', path: '/' },
              { name: 'About Us', path: '/about-us' },
            ])],
          }),
          body: renderStaticPageBody(
            'About Kronos',
            readLocalizedValue('en', seoSettings?.pages?.['about-us']?.meta_description, seoSettings?.pages?.['about-us']?.meta_description_en)
              || 'Learn about the Kronos boutique, our philosophy, and our focus on rare luxury timepieces.',
            [
              'Kronos Luxury Timepieces connects collectors in Vietnam with rare watches, concierge service, and boutique-level expertise.',
            ],
          ),
        },
        {
          path: '/contact-us',
          meta: buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            pageKey: 'contact-us',
            title: 'Contact Kronos',
            description: readLocalizedValue('en', seoSettings?.pages?.['contact-us']?.meta_description, seoSettings?.pages?.['contact-us']?.meta_description_en)
              || 'Contact Kronos for acquisitions, appointments, after-sales service, and boutique visits.',
            canonicalPath: '/contact-us',
            type: 'website',
            structuredData: [createBreadcrumbJsonLd(resolvedSiteUrl, [
              { name: 'Home', path: '/' },
              { name: 'Contact Us', path: '/contact-us' },
            ])],
          }),
          body: renderStaticPageBody(
            'Contact Kronos',
            readLocalizedValue('en', seoSettings?.pages?.['contact-us']?.meta_description, seoSettings?.pages?.['contact-us']?.meta_description_en)
              || 'Contact Kronos for acquisitions, appointments, after-sales service, and boutique visits.',
            [
              'Reach the boutique team for sourcing requests, private appointments, trade-ins, and after-sales support.',
            ],
          ),
        },
        {
          path: '/news-events',
          meta: buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            pageKey: 'news-events',
            title: 'News & Events',
            description: readLocalizedValue('en', seoSettings?.pages?.['news-events']?.meta_description, seoSettings?.pages?.['news-events']?.meta_description_en)
              || 'Read the latest Kronos editorials, event coverage, and luxury watch insights.',
            canonicalPath: '/news-events',
            type: 'website',
            structuredData: [createBreadcrumbJsonLd(resolvedSiteUrl, [
              { name: 'Home', path: '/' },
              { name: 'News & Events', path: '/news-events' },
            ])],
          }),
          body: renderStaticPageBody(
            'News & Events',
            readLocalizedValue('en', seoSettings?.pages?.['news-events']?.meta_description, seoSettings?.pages?.['news-events']?.meta_description_en)
              || 'Read the latest Kronos editorials, event coverage, and luxury watch insights.',
            [
              'Explore boutique news, collecting insights, and stories connected to current inventory and industry events.',
            ],
          ),
        },
      ]

      const articlePages: PrerenderedPage[] = articles
        .filter((article) => article.slug)
        .map((article) => {
          const slug = article.slug as string
          const articleTitle = readLocalizedValue('en', article.seo_title || article.title, article.seo_title_en || article.title_en)
            || 'News & Events'
          const articleDescription = readLocalizedValue('en', article.seo_description || article.summary || article.content, article.seo_description_en || article.summary_en || article.content_en)
            || 'Read the latest story from Kronos Luxury Timepieces.'
          const canonicalUrl = normalizeAbsoluteUrl(article.canonical_url) || toAbsoluteUrl(resolvedSiteUrl, `/news-events/${slug}`)
          const meta = buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            pageKey: 'news-events',
            title: articleTitle,
            description: articleDescription,
            image: article.seo_image_url || article.image_url,
            canonicalUrl,
            noindex: article.noindex,
            type: 'article',
            structuredData: [
              createBreadcrumbJsonLd(resolvedSiteUrl, [
                { name: 'Home', path: '/' },
                { name: 'News & Events', path: '/news-events' },
                { name: articleTitle, path: `/news-events/${slug}` },
              ]),
              {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: articleTitle,
                description: trimDescription(articleDescription),
                image: normalizeAbsoluteUrl(article.seo_image_url || article.image_url) || undefined,
                datePublished: article.date || article.created_at,
                dateModified: article.created_at,
                mainEntityOfPage: canonicalUrl,
              },
            ],
          })

          return {
            path: `/news-events/${slug}`,
            meta,
            body: renderArticleBody(article),
          }
        })
        .filter((page) => !page.meta.noindex)

      const watchPages: PrerenderedPage[] = watchDetails
        .filter((watch) => watch.id !== undefined && watch.id !== null)
        .map((watch) => {
          const watchTitle = readLocalizedValue('en', watch.seo_title || watch.name, watch.seo_title_en || watch.name)
            || 'Luxury Timepiece'
          const watchDescription = readLocalizedValue('en', watch.seo_description || watch.description, watch.seo_description_en || watch.description_en)
            || 'Explore this luxury watch from Kronos.'
          const canonicalUrl = normalizeAbsoluteUrl(watch.canonical_url) || toAbsoluteUrl(resolvedSiteUrl, `/watch/${watch.id}`)
          const meta = buildSeoMeta({
            settings: seoSettings,
            siteUrl: resolvedSiteUrl,
            title: watchTitle,
            description: watchDescription,
            image: watch.seo_image_url || watch.image,
            canonicalUrl,
            noindex: watch.noindex,
            type: 'product',
            structuredData: [
              createBreadcrumbJsonLd(resolvedSiteUrl, [
                { name: 'Home', path: '/' },
                { name: 'Collections', path: '/collections' },
                { name: watch.name || watchTitle, path: `/watch/${watch.id}` },
              ]),
              {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: watch.name || watchTitle,
                description: trimDescription(watchDescription),
                image: normalizeAbsoluteUrl(watch.seo_image_url || watch.image) || undefined,
                sku: watch.ref || undefined,
                brand: watch.brand ? { '@type': 'Brand', name: watch.brand } : undefined,
                category: watch.collection || undefined,
                url: canonicalUrl,
              },
            ],
          })

          return {
            path: `/watch/${watch.id}`,
            meta,
            body: renderWatchBody(watch),
          }
        })
        .filter((page) => !page.meta.noindex)

      const allPages = [...staticPages, ...articlePages, ...watchPages]

      await Promise.all(
        allPages.map(async (page) => {
          const html = renderPageHtml(indexTemplate, page)
          await writePrerenderedPage(outputDir, page, html, page.path === '/')
        }),
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react(), createSeoAssetsPlugin(mode)],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react';
          if (id.includes('axios')) return 'vendor-axios';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (id.includes('motion')) return 'vendor-motion';

          return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5175,
  },
}))
