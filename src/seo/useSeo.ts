import { useEffect, useState } from 'react';
import { publicApi, type PublicSeoPageKey, type PublicSeoSettings } from '@/lib/api';

type JsonLd = Record<string, unknown>;

type SeoOptions = {
  pageKey?: PublicSeoPageKey;
  lang?: string;
  title?: string;
  description?: string;
  image?: string;
  canonicalPath?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
  structuredData?: JsonLd | JsonLd[];
};

const META_TAGS = [
  { kind: 'name', key: 'description' },
  { kind: 'name', key: 'robots' },
  { kind: 'property', key: 'og:title' },
  { kind: 'property', key: 'og:description' },
  { kind: 'property', key: 'og:type' },
  { kind: 'property', key: 'og:url' },
  { kind: 'property', key: 'og:image' },
  { kind: 'property', key: 'og:site_name' },
  { kind: 'name', key: 'twitter:card' },
  { kind: 'name', key: 'twitter:title' },
  { kind: 'name', key: 'twitter:description' },
  { kind: 'name', key: 'twitter:image' },
] as const;

let cachedSettings: PublicSeoSettings | null = null;
let pendingSettings: Promise<PublicSeoSettings> | null = null;

const readLocalizedValue = (
  lang: string,
  primary?: string | null,
  english?: string | null,
) => (lang === 'en' ? english || primary || '' : primary || english || '');

const ensureMeta = (kind: 'name' | 'property', key: string) => {
  const selector = `meta[${kind}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) return existing;
  const meta = document.createElement('meta');
  meta.setAttribute(kind, key);
  document.head.appendChild(meta);
  return meta;
};

const ensureCanonicalLink = () => {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (existing) return existing;
  const link = document.createElement('link');
  link.setAttribute('rel', 'canonical');
  document.head.appendChild(link);
  return link;
};

const ensureJsonLdScript = () => {
  const existing = document.head.querySelector<HTMLScriptElement>('script[data-kronos-seo="json-ld"]');
  if (existing) return existing;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.kronosSeo = 'json-ld';
  document.head.appendChild(script);
  return script;
};

const trimDescription = (value: string) => {
  if (value.length <= 160) return value;
  return `${value.slice(0, 157).trim()}...`;
};

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toAbsoluteUrl = (value: string | undefined, origin: string) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  try {
    return new URL(value, origin).toString();
  } catch {
    return value;
  }
};

export const useSeo = ({
  pageKey,
  lang = 'vi',
  title,
  description,
  image,
  canonicalPath,
  canonicalUrl,
  noindex,
  type = 'website',
  structuredData,
}: SeoOptions) => {
  const [settings, setSettings] = useState<PublicSeoSettings | null>(cachedSettings);

  useEffect(() => {
    if (cachedSettings) return;
    if (!pendingSettings) {
      pendingSettings = publicApi.getSeoSettings().then((payload) => {
        cachedSettings = payload;
        return payload;
      });
    }

    void pendingSettings.then((payload) => setSettings(payload));
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const pageSettings = pageKey ? settings?.pages?.[pageKey] : undefined;
    const siteName = readLocalizedValue(lang, settings?.site_name, settings?.site_name_en) || 'Kronos Luxury Timepieces';
    const defaultTitle = readLocalizedValue(lang, settings?.default_title, settings?.default_title_en) || siteName;
    const defaultDescription = readLocalizedValue(lang, settings?.default_description, settings?.default_description_en);
    const pageTitle = readLocalizedValue(lang, pageSettings?.meta_title, pageSettings?.meta_title_en);
    const pageDescription = readLocalizedValue(lang, pageSettings?.meta_description, pageSettings?.meta_description_en);
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin || settings?.site_url;

    const resolvedTitleBase = title || pageTitle || defaultTitle;
    const resolvedTitle = resolvedTitleBase === siteName ? resolvedTitleBase : `${resolvedTitleBase} | ${siteName}`;
    const rawDescription = description || pageDescription || defaultDescription || siteName;
    const resolvedDescription = trimDescription(stripHtml(rawDescription));
    const resolvedImage = toAbsoluteUrl(image || pageSettings?.og_image_url || settings?.default_og_image_url, origin);
    const resolvedCanonical = canonicalUrl
      || toAbsoluteUrl(canonicalPath || pageSettings?.canonical_path || window.location.pathname, origin);
    const resolvedNoindex = Boolean(noindex ?? pageSettings?.noindex);

    document.title = resolvedTitle;
    document.documentElement.lang = lang === 'en' ? 'en' : 'vi';

    META_TAGS.forEach(({ kind, key }) => {
      const meta = ensureMeta(kind, key);
      const content =
        key === 'description' ? resolvedDescription :
        key === 'robots' ? (resolvedNoindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large') :
        key === 'og:title' ? resolvedTitle :
        key === 'og:description' ? resolvedDescription :
        key === 'og:type' ? type :
        key === 'og:url' ? resolvedCanonical :
        key === 'og:image' ? resolvedImage :
        key === 'og:site_name' ? siteName :
        key === 'twitter:card' ? (resolvedImage ? 'summary_large_image' : 'summary') :
        key === 'twitter:title' ? resolvedTitle :
        key === 'twitter:description' ? resolvedDescription :
        key === 'twitter:image' ? resolvedImage :
        '';

      if (content) {
        meta.setAttribute('content', content);
      } else {
        meta.removeAttribute('content');
      }
    });

    ensureCanonicalLink().setAttribute('href', resolvedCanonical);

    const script = ensureJsonLdScript();
    if (structuredData) {
      const payload = Array.isArray(structuredData) ? structuredData : [structuredData];
      script.textContent = JSON.stringify(payload);
    } else {
      script.textContent = '';
    }
  }, [canonicalPath, canonicalUrl, description, image, lang, noindex, pageKey, settings, structuredData, title, type]);
};

export const createBreadcrumbJsonLd = (origin: string, items: Array<{ name: string; path: string }>): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path, origin),
  })),
});

export const createOrganizationJsonLd = (settings: PublicSeoSettings | null, lang: string, origin: string): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: readLocalizedValue(lang, settings?.organization_name, settings?.organization_name_en) || 'Kronos Luxury Timepieces',
  url: origin,
  logo: toAbsoluteUrl(settings?.logo_url || settings?.default_og_image_url, origin),
});
