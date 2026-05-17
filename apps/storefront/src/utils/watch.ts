import type { Watch, Accessory } from '@/types';

export const getWatchUrl = (watch: Watch) => {
    if (watch.brand_slug && watch.ref) {
        const brand = watch.brand_slug;
        const collection = watch.collection_slug ? `${watch.collection_slug}/` : '';
        const ref = watch.ref.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return `/watch/${brand}/${collection}${ref}`;
    }
    return `/watch/${watch.id}`;
};

export const getAccessoryUrl = (accessory: Accessory) => {
    if (accessory.brand_slug && accessory.ref) {
        const brand = accessory.brand_slug;
        const collection = accessory.collection_slug ? `${accessory.collection_slug}/` : '';
        const ref = accessory.ref.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return `/accessory/${brand}/${collection}${ref}`;
    }
    return `/accessory/${accessory.id}`;
};
