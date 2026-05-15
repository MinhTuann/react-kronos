import type { Accessory, Watch } from '@/types';

const slugifyRef = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getWatchUrl = (watch: Watch) => {
  if (watch.brand_slug && watch.ref) {
    const collectionSegment = watch.collection_slug ? `${watch.collection_slug}/` : '';
    return `/watch/${watch.brand_slug}/${collectionSegment}${slugifyRef(watch.ref)}`;
  }

  return `/watch/${watch.id}`;
};

export const getAccessoryUrl = (accessory: Accessory) => {
  if (accessory.brand_slug && accessory.ref) {
    const collectionSegment = accessory.collection_slug ? `${accessory.collection_slug}/` : '';
    return `/accessory/${accessory.brand_slug}/${collectionSegment}${slugifyRef(accessory.ref)}`;
  }

  return `/accessory/${accessory.id}`;
};
