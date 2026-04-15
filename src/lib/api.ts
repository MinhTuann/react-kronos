import axios from 'axios';
import type { Watch } from '../types';
import type { PublicBrand, PublicCollection } from '@kronos/contracts';

const API_URL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({ baseURL: API_URL });

type RequestOptions = {
  signal?: AbortSignal;
};

type GetOptions = RequestOptions & {
  params?: Record<string, unknown>;
  cache?: boolean;
};

const inFlightRequests = new Map<string, Promise<unknown>>();
const responseCache = new Map<string, unknown>();

const normalizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .filter(([, nested]) => nested !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .reduce<Record<string, unknown>>((acc, [key, nested]) => {
        acc[key] = normalizeValue(nested);
        return acc;
      }, {});
  }

  return value;
};

const createRequestKey = (url: string, params?: Record<string, unknown>) =>
  `${url}:${JSON.stringify(normalizeValue(params ?? {}))}`;

const getJson = async <T>({ url, params, signal, cache = false }: GetOptions & { url: string }): Promise<T> => {
  const requestKey = createRequestKey(url, params);

  if (cache && responseCache.has(requestKey)) {
    return responseCache.get(requestKey) as T;
  }

  // Only share requests that are not tied to a component-specific abort signal.
  if (!signal && inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey) as Promise<T>;
  }

  const request = apiClient.get<T>(url, { params, signal })
    .then((response) => {
      if (cache) {
        responseCache.set(requestKey, response.data);
      }
      return response.data;
    })
    .finally(() => {
      if (!signal) {
        inFlightRequests.delete(requestKey);
      }
    });

  if (!signal) {
    inFlightRequests.set(requestKey, request);
  }

  return request;
};

export interface PublicArticle {
  id: string;
  title: string;
  title_en?: string;
  slug: string;
  category: string;
  category_en?: string;
  image_url?: string;
  summary?: string;
  summary_en?: string;
  content?: string;
  content_en?: string;
  seo_title?: string;
  seo_title_en?: string;
  seo_description?: string;
  seo_description_en?: string;
  seo_image_url?: string;
  canonical_url?: string;
  noindex?: boolean;
  status: string;
  display_order: number;
  date: string;
  created_at: string;
}

export type PublicSeoPageKey = 'home' | 'collections' | 'about-us' | 'contact-us' | 'news-events';

export interface PublicSeoPageEntry {
  meta_title?: string;
  meta_title_en?: string;
  meta_description?: string;
  meta_description_en?: string;
  og_image_url?: string;
  canonical_path?: string;
  noindex?: boolean;
}

export interface PublicSeoSettings {
  site_name?: string;
  site_name_en?: string;
  default_title?: string;
  default_title_en?: string;
  default_description?: string;
  default_description_en?: string;
  default_og_image_url?: string;
  site_url?: string;
  organization_name?: string;
  organization_name_en?: string;
  logo_url?: string;
  pages?: Record<PublicSeoPageKey, PublicSeoPageEntry>;
}
  
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    hasNextPage: boolean;
    lastCursor: string | null;
  };
}

export type { PublicBrand, PublicCollection };
export type { RequestOptions };

export const publicApi = {
  // Fetch Brands
  getBrands: async (options?: RequestOptions): Promise<PublicBrand[]> => {
    return getJson<PublicBrand[]>({ url: '/brands', signal: options?.signal, cache: true });
  },

  // Fetch Collections
  getCollections: async (brandId?: string, options?: RequestOptions): Promise<PublicCollection[]> => {
    return getJson<PublicCollection[]>({
      url: '/collections',
      params: { brand_id: brandId },
      signal: options?.signal,
      cache: true,
    });
  },

  // Fetch Public Watches (Paginated)
  getWatches: async (
    brandId?: string, 
    collectionIds?: string | string[], 
    search?: string, 
    cursor?: string, 
    limit?: number, 
    options?: RequestOptions
  ): Promise<PaginatedResponse<Watch>> => {
    return getJson<PaginatedResponse<Watch>>({
      url: '/watches',
      params: {
        brand_id: brandId,
        collection_ids: collectionIds,
        search,
        cursor,
        limit,
      },
      signal: options?.signal,
    });
  },

  // Fetch Single Detailed Watch
  getWatchById: async (id: string | number, options?: RequestOptions): Promise<Watch> => {
    return getJson<Watch>({ url: `/watches/${id}`, signal: options?.signal });
  },

  // Fetch In-Stock Watches (Random 8)
  getInStockWatches: async (options?: RequestOptions): Promise<Watch[]> => {
    return getJson<Watch[]>({ url: '/in-stock', signal: options?.signal, cache: true });
  },

  // Fetch Home Page Dynamic Content
  getHomePageData: async (options?: RequestOptions): Promise<any> => {
    return getJson<any>({ url: '/homepage', signal: options?.signal, cache: true });
  },

  getSeoSettings: async (options?: RequestOptions): Promise<PublicSeoSettings> => {
    return getJson<PublicSeoSettings>({ url: '/seo', signal: options?.signal, cache: true });
  },

  // Fetch Articles (Paginated)
  getArticles: async (cursor?: string, limit?: number, options?: RequestOptions): Promise<PaginatedResponse<PublicArticle>> => {
    return getJson<PaginatedResponse<PublicArticle>>({ 
        url: '/articles', 
        params: { cursor, limit },
        signal: options?.signal, 
        cache: false 
    });
  },

  // Fetch Single Article
  getArticleBySlug: async (slug: string, options?: RequestOptions): Promise<PublicArticle> => {
    return getJson<PublicArticle>({ url: `/articles/${slug}`, signal: options?.signal, cache: false });
  }
};
