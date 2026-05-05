import type { Watch } from '@/types';

export const getWatchUrl = (watch: Watch) => {
    if (watch.brand_slug && watch.ref) {
        const brand = watch.brand_slug;
        const collection = watch.collection_slug ? `${watch.collection_slug}/` : '';
        const ref = watch.ref.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        return `/watch/${brand}/${collection}${ref}`;
    }
    return `/watch/${watch.id}`;
};
