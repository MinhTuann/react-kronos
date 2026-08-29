export interface VideoSlide {
  id?: number | string;
  url: string;
  thumbnail_url?: string;
  title: string;
  title_en?: string | null;
  description: string;
  description_en?: string | null;
}

export interface Watch {
  id: string | number;
  brand: string;
  brand_slug?: string;
  collection: string;
  collection_slug?: string;
  name: string;
  ref: string;
  price?: number;
  image: string;
  color: string;
  description: string;
  description_en?: string | null;
  view_more_content?: string | null;
  view_more_content_en?: string | null;
  size?: string;
  material?: string;
  material_en?: string | null;
  movement?: string;
  movement_en?: string | null;
  strap?: string;
  strap_en?: string | null;
  dial?: string;
  dial_en?: string | null;
  condition?: string;
  condition_en?: string | null;
  seo_title?: string | null;
  seo_title_en?: string | null;
  seo_description?: string | null;
  seo_description_en?: string | null;
  seo_image_url?: string | null;
  featured_avatar_url?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  stock_quantity?: number;
  sold_quantity?: number;
  is_in_stock?: boolean;
  images?: string[];
}

export interface Accessory {
  id: string | number;
  brand: string;
  brand_slug?: string;
  collection: string;
  collection_slug?: string;
  name: string;
  ref: string;
  price?: number;
  image: string;
  description: string;
  description_en?: string | null;
  view_more_content?: string | null;
  view_more_content_en?: string | null;
  size?: string;
  material?: string;
  material_en?: string | null;
  color?: string;
  color_en?: string | null;
  condition?: string;
  condition_en?: string | null;
  seo_title?: string | null;
  seo_title_en?: string | null;
  seo_description?: string | null;
  seo_description_en?: string | null;
  seo_image_url?: string | null;
  featured_avatar_url?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
  stock_quantity?: number;
  sold_quantity?: number;
  is_in_stock?: boolean;
  images?: string[];
}
