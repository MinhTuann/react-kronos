export interface VideoSlide {
  id: number;
  url: string;
  thumbnail_url?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
}

export interface Watch {
  id: string | number;
  brand: string;
  collection: string;
  name: string;
  ref: string;
  price?: number;
  image: string;
  color: string;
  description: string;
  description_en?: string;
  size?: string;
  material?: string;
  material_en?: string;
  movement?: string;
  movement_en?: string;
  strap?: string;
  strap_en?: string;
  dial?: string;
  dial_en?: string;
  condition?: string;
  condition_en?: string;
}