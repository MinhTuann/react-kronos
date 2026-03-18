export interface VideoSlide {
  id: number;
  url: string;
  thumbnail_url?: string;
  title: string;
  description: string;
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
}