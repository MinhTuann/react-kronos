import { describe, it, expect } from 'vitest';
import { createBreadcrumbJsonLd, createOrganizationJsonLd } from '../src/seo/useSeo';
import type { PublicSeoSettings } from '../src/lib/api';

interface BreadcrumbJsonLd {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

interface OrganizationJsonLd {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
}

describe('Storefront SEO JSON-LD Helpers', () => {
  const origin = 'https://kronosluxury.vn';

  describe('createBreadcrumbJsonLd', () => {
    it('creates valid Schema.org BreadcrumbList payload', () => {
      const items = [
        { name: 'Home', path: '/' },
        { name: 'Watches', path: '/watches' },
        { name: 'Rolex Submariner', path: '/watch/rolex/submariner/126610ln' }
      ];

      const jsonLd = createBreadcrumbJsonLd(origin, items) as unknown as BreadcrumbJsonLd;

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(3);
      expect(jsonLd.itemListElement[0]).toEqual({
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://kronosluxury.vn/'
      });
      expect(jsonLd.itemListElement[2].item).toBe('https://kronosluxury.vn/watch/rolex/submariner/126610ln');
    });
  });

  describe('createOrganizationJsonLd', () => {
    it('generates Organization schema with fallback values', () => {
      const jsonLd = createOrganizationJsonLd(null, 'en', origin) as unknown as OrganizationJsonLd;

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Organization');
      expect(jsonLd.name).toBe('Kronos Luxury Timepieces');
      expect(jsonLd.url).toBe(origin);
    });

    it('generates Organization schema with custom settings', () => {
      const customSettings = {
        organization_name: 'Kronos VN',
        organization_name_en: 'Kronos Vietnam Official',
        logo_url: 'https://cdn.kronos.vn/logo.png',
        default_og_image_url: 'https://cdn.kronos.vn/og.png'
      } as unknown as PublicSeoSettings;

      const jsonLdEn = createOrganizationJsonLd(customSettings, 'en', origin) as unknown as OrganizationJsonLd;
      expect(jsonLdEn.name).toBe('Kronos Vietnam Official');
      expect(jsonLdEn.logo).toBe('https://cdn.kronos.vn/logo.png');

      const jsonLdVi = createOrganizationJsonLd(customSettings, 'vi', origin) as unknown as OrganizationJsonLd;
      expect(jsonLdVi.name).toBe('Kronos VN');
    });
  });
});
