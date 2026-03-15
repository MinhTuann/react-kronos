import axios from 'axios';
import type { Watch } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Add simple generic interfaces for Brands/Collections in case they are needed
export interface PublicBrand {
    id: string;
    name: string;
}

export interface PublicCollection {
    id: string;
    brand_id: string;
    name: string;
}

export const publicApi = {
  // Fetch Brands
  getBrands: async (): Promise<PublicBrand[]> => {
    const response = await axios.get(`${API_URL}/brands`);
    return response.data;
  },

  // Fetch Collections
  getCollections: async (brandId?: string): Promise<PublicCollection[]> => {
    const response = await axios.get(`${API_URL}/collections`, {
        params: { brand_id: brandId }
    });
    return response.data;
  },

  // Fetch Public Watches (Array)
  getWatches: async (brandId?: string, collectionId?: string): Promise<Watch[]> => {
    const response = await axios.get(`${API_URL}/watches`, {
      params: {
         brand_id: brandId,
         collection_id: collectionId
      }
    });
    return response.data;
  },

  // Fetch Single Detailed Watch
  getWatchById: async (id: string | number): Promise<Watch> => {
    const response = await axios.get(`${API_URL}/watches/${id}`);
    return response.data;
  }
};
