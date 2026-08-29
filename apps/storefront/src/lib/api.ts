import axios from 'axios';
import type { Watch, Accessory, VideoSlide } from '../types';
import type { PublicBrand, PublicCollection, PublicAccessoryType } from '@kronos/contracts-public';

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

export type ContactRequestPurpose = 'timepiece_acquisition' | 'appointment' | 'service' | 'general';

export interface ContactRequestWatchInfo {
  id?: string | null;
  brand?: string | null;
  collection?: string | null;
  name?: string | null;
  ref?: string | null;
  image?: string | null;
  price?: number | null;
  url?: string | null;
}

export interface CreateContactRequestPayload {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  purpose: ContactRequestPurpose;
  message: string;
  selected_watch?: ContactRequestWatchInfo | null;
  source_path?: string;
}

export interface PublicContactRequest {
  id: string;
  status: 'unresolved' | 'solved';
  submitted_at?: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    hasNextPage: boolean;
    lastCursor: string | null;
  };
}

export type { PublicBrand, PublicCollection, PublicAccessoryType };
export type { RequestOptions };

export interface HomePageSlide {
  id?: string | number;
  video_url?: string;
  url?: string;
  thumbnail_url?: string;
  title: string;
  title_en?: string | null;
  description: string;
  description_en?: string | null;
  display_order?: number;
}

export interface HomePageSections {
  best_brand?: Watch;
  second_brand?: Watch;
  third_brand?: Watch;
  our_story?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface HomePageResponse {
  slides?: VideoSlide[];
  news?: PublicArticle[];
  sections?: HomePageSections;
}

export const publicApi = {
  // Fetch Brands
  getBrands: async (
    typeOrOptions?: 'watch' | 'accessory' | RequestOptions,
    maybeOptions?: RequestOptions
  ): Promise<PublicBrand[]> => {
    const type = typeof typeOrOptions === 'string' ? typeOrOptions : undefined;
    const options = typeof typeOrOptions === 'string' ? maybeOptions : typeOrOptions;

    return getJson<PublicBrand[]>({
      url: '/brands',
      params: { type },
      signal: options?.signal,
      cache: true
    });
  },

  // Fetch Collections
  getCollections: async (
    brandId?: string,
    typeOrOptions?: 'watch' | 'accessory' | RequestOptions,
    maybeOptions?: RequestOptions
  ): Promise<PublicCollection[]> => {
    const type = typeof typeOrOptions === 'string' ? typeOrOptions : undefined;
    const options = typeof typeOrOptions === 'string' ? maybeOptions : typeOrOptions;

    return getJson<PublicCollection[]>({
      url: '/collections',
      params: { brand_id: brandId, type },
      signal: options?.signal,
      cache: true
    });
  },

  // Fetch Public Watches (Paginated)
  getWatches: async (
    brandId?: string,
    collectionIds?: string | string[],
    search?: string,
    cursor?: string,
    limit?: number,
    inStock?: boolean,
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
        in_stock: inStock
      },
      signal: options?.signal,
    });
  },

  // Fetch Single Detailed Watch
  getWatchById: async (id: string | number, options?: RequestOptions): Promise<Watch> => {
    return getJson<Watch>({ url: `/watches/${id}`, signal: options?.signal });
  },

  getWatchBySlug: async (brand: string, ref: string, collection?: string, options?: RequestOptions): Promise<Watch> => {
    const url = collection
        ? `/watch-by-slug/${brand}/${collection}/${ref}`
        : `/watch-by-slug/${brand}/${ref}`;
    return getJson<Watch>({ url, signal: options?.signal });
  },

  // Fetch In-Stock Watches (Random 8)
  getInStockWatches: async (options?: RequestOptions): Promise<Watch[]> => {
    return getJson<Watch[]>({ url: '/in-stock', signal: options?.signal, cache: true });
  },

  // Fetch Home Page Dynamic Content
  getHomePageData: async (options?: RequestOptions): Promise<HomePageResponse> => {
    return getJson<HomePageResponse>({ url: '/homepage', signal: options?.signal, cache: true });
  },

  getSeoSettings: async (options?: RequestOptions): Promise<PublicSeoSettings> => {
    return getJson<PublicSeoSettings>({ url: '/seo', signal: options?.signal, cache: true });
  },

  createContactRequest: async (payload: CreateContactRequestPayload): Promise<PublicContactRequest> => {
    const response = await apiClient.post<{ data: PublicContactRequest }>('/contact-requests', payload);
    return response.data.data;
  },

  // Fetch Articles (Paginated)
  getArticles: async (cursor?: string, limit?: number, isPolicy?: boolean, options?: RequestOptions): Promise<PaginatedResponse<PublicArticle>> => {
    return getJson<PaginatedResponse<PublicArticle>>({
        url: '/articles',
        params: { cursor, limit, is_policy: isPolicy },
        signal: options?.signal,
        cache: false
    });
  },

  // Fetch Single Article
  getArticleBySlug: async (slug: string, options?: RequestOptions): Promise<PublicArticle> => {
    return getJson<PublicArticle>({ url: `/articles/${slug}`, signal: options?.signal, cache: false });
  },

  // Fetch Public Accessories (Paginated)
  getAccessories: async (
    brandId?: string,
    collectionIds?: string | string[],
    accessoryTypeIds?: string | string[],
    search?: string,
    cursor?: string,
    limit?: number,
    inStock?: boolean,
    options?: RequestOptions
  ): Promise<PaginatedResponse<Accessory>> => {
    return getJson<PaginatedResponse<Accessory>>({
      url: '/accessories',
      params: {
        brand_id: brandId,
        collection_ids: collectionIds,
        accessory_type_ids: accessoryTypeIds,
        search,
        cursor,
        limit,
        in_stock: inStock
      },
      signal: options?.signal,
    });
  },

  // Fetch Accessory Types
  getAccessoryTypes: async (options?: RequestOptions): Promise<PublicAccessoryType[]> => {
    return getJson<PublicAccessoryType[]>({ url: '/accessory-types', signal: options?.signal, cache: true });
  },

  // Fetch Single Detailed Accessory
  getAccessoryById: async (id: string | number, options?: RequestOptions): Promise<Accessory> => {
    return getJson<Accessory>({ url: `/accessories/${id}`, signal: options?.signal });
  },

  getAccessoryBySlug: async (brand: string, ref: string, collection?: string, options?: RequestOptions): Promise<Accessory> => {
    const url = collection
        ? `/accessory-by-slug/${brand}/${collection}/${ref}`
        : `/accessory-by-slug/${brand}/${ref}`;
    return getJson<Accessory>({ url, signal: options?.signal });
  }
};
