export interface PublicBrand {
  id: string;
  name: string;
}

export interface PublicCollection {
  id: string;
  brand_id: string;
  name: string;
}

export interface PublicWatch {
  id: string;
  brand: string;
  collection: string;
  name: string;
  ref: string;
  price?: number;
  image: string;
  images?: string[];
  size?: string | null;
  material?: string | null;
  material_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  view_more_content?: string | null;
  view_more_content_en?: string | null;
  movement?: string | null;
  movement_en?: string | null;
  strap?: string | null;
  strap_en?: string | null;
  dial?: string | null;
  dial_en?: string | null;
  condition?: string | null;
  condition_en?: string | null;
  seo_title?: string | null;
  seo_title_en?: string | null;
  seo_description?: string | null;
  seo_description_en?: string | null;
  seo_image_url?: string | null;
  canonical_url?: string | null;
  noindex?: boolean;
}
