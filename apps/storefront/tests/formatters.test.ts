import { describe, it, expect } from 'vitest';
import { getWatchUrl, getAccessoryUrl } from '../src/utils/watch';
import type { Watch, Accessory } from '../src/types';

describe('Storefront URL Formatters', () => {
  describe('getWatchUrl', () => {
    it('generates friendly slug URL when brand_slug and ref exist', () => {
      const watch: Watch = {
        id: '123',
        brand: 'Rolex',
        brand_slug: 'rolex',
        collection: 'Submariner',
        collection_slug: 'submariner',
        name: 'Submariner Date',
        ref: '126610LN',
        image: '/img.png'
      };

      const url = getWatchUrl(watch);
      expect(url).toBe('/watch/rolex/submariner/126610ln');
    });

    it('generates friendly slug URL without collection if collection_slug is missing', () => {
      const watch: Watch = {
        id: '456',
        brand: 'Patek Philippe',
        brand_slug: 'patek-philippe',
        collection: 'Calatrava',
        name: 'Calatrava',
        ref: '5227R-001',
        image: '/img.png'
      };

      const url = getWatchUrl(watch);
      expect(url).toBe('/watch/patek-philippe/5227r-001');
    });

    it('falls back to id URL if brand_slug or ref is missing', () => {
      const watch: Watch = {
        id: '789',
        brand: 'Cartier',
        collection: 'Santos',
        name: 'Santos de Cartier',
        ref: '',
        image: '/img.png'
      };

      const url = getWatchUrl(watch);
      expect(url).toBe('/watch/789');
    });
  });

  describe('getAccessoryUrl', () => {
    it('generates friendly slug URL for accessories', () => {
      const accessory: Accessory = {
        id: 'acc-1',
        brand: 'Omega',
        brand_slug: 'omega',
        collection_slug: 'straps',
        name: 'NATO Strap',
        ref: '031ZSZ002046',
        image: '/strap.png'
      };

      const url = getAccessoryUrl(accessory);
      expect(url).toBe('/accessory/omega/straps/031zsz002046');
    });
  });
});
