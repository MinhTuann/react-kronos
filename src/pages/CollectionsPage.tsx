import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoToTop, LoadMore } from '@/components/app';
import type { Watch } from '@/types';
import { WatchItem } from '@/components/home/InStocks';
import { CollectionsGridSkeleton } from '@/components/common/Skeleton';

import { publicApi } from '@/lib/api';
import type { PublicBrand, PublicCollection } from '@/lib/api';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';

const readMultiValueParam = (params: URLSearchParams, key: string): string[] => {
    const repeated = params.getAll(key).filter(Boolean);
    if (repeated.length > 0) {
        return repeated.flatMap(value => value.split(',')).map(value => value.trim()).filter(Boolean);
    }

    const single = params.get(key);
    if (!single) {
        return [];
    }

    return single.split(',').map(value => value.trim()).filter(Boolean);
};

const CollectionsPage: React.FC = () => {
    // States
    const [watches, setWatches] = useState<Watch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { t, i18n } = useTranslation();
    const [hasNextPage, setHasNextPage] = useState(false);
    const [lastCursor, setLastCursor] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(new URLSearchParams(window.location.search).get('in_stock') === 'true');
    // const [sortMethod, setSortMethod] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');

    // Search Query parsing
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || undefined;

    // Filter States
    const [brands, setBrands] = useState<PublicBrand[]>([]);
    const [collections, setCollections] = useState<PublicCollection[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [isInStockOnly, setIsInStockOnly] = useState(queryParams.get('in_stock') === 'true');
    const currentLang = i18n.language.split('-')[0];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const selectedBrandName = brands.find((brand) => brand.id === selectedBrands[0])?.name;
    const selectedCollectionNames = collections
        .filter((collection) => selectedCollections.includes(collection.id))
        .map((collection) => collection.name);
    const hasFacetFilters = selectedBrands.length > 0 || selectedCollections.length > 0;
    const shouldNoindex = Boolean(searchQuery) || hasFacetFilters;
    const dynamicFacetLabel = searchQuery
        ? (currentLang === 'en' ? `Search: ${searchQuery}` : `Tim kiem: ${searchQuery}`)
        : selectedCollectionNames.length > 0
            ? selectedCollectionNames.join(', ')
            : selectedBrandName;
    const seoTitle = searchQuery
        ? (currentLang === 'en'
            ? `Search results for "${searchQuery}" watches`
            : `Ket qua tim kiem dong ho cho "${searchQuery}"`)
        : selectedCollectionNames.length > 0
            ? (currentLang === 'en'
                ? `${selectedCollectionNames.join(', ')} watches`
                : `Dong ho ${selectedCollectionNames.join(', ')}`)
            : selectedBrandName
                ? (currentLang === 'en'
                    ? `${selectedBrandName} watches`
                    : `Dong ho ${selectedBrandName}`)
                : undefined;
    const seoDescription = searchQuery
        ? (currentLang === 'en'
            ? `Browse Kronos watch search results for ${searchQuery}, including curated luxury timepieces and available inventory.`
            : `Xem ket qua tim kiem tai Kronos cho tu khoa ${searchQuery}, bao gom nhung mau dong ho cao cap dang san co.`)
        : selectedCollectionNames.length > 0
            ? (currentLang === 'en'
                ? `Explore ${selectedCollectionNames.join(', ')} watches at Kronos, with refined selection details and current availability.`
                : `Kham pha dong ho ${selectedCollectionNames.join(', ')} tai Kronos voi tuyen chon tinh te va tinh trang san co hien tai.`)
            : selectedBrandName
                ? (currentLang === 'en'
                    ? `Discover ${selectedBrandName} watches curated by Kronos, from iconic references to available collector pieces.`
                    : `Kham pha dong ho ${selectedBrandName} duoc Kronos tuyen chon, tu nhung mau bieu tuong den cac chiec danh cho nha suu tap.`)
                : undefined;
    const breadcrumbItems = [
        { name: currentLang === 'en' ? 'Home' : 'Trang chu', path: '/' },
        { name: currentLang === 'en' ? 'Collections' : 'Bo suu tap', path: '/collections' },
        ...(dynamicFacetLabel ? [{ name: dynamicFacetLabel, path: `${location.pathname}${location.search}` }] : []),
    ];

    useSeo({
        pageKey: 'collections',
        lang: currentLang,
        title: seoTitle,
        description: seoDescription,
        canonicalPath: '/collections',
        noindex: shouldNoindex,
        structuredData: createBreadcrumbJsonLd(origin, breadcrumbItems),
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const brandId = params.get('brandId') || params.get('brand_id');
        const collectionIds = [
            ...readMultiValueParam(params, 'collections'),
            ...readMultiValueParam(params, 'collectionId'),
            ...readMultiValueParam(params, 'collection_ids'),
        ];

        setSelectedBrands(brandId ? [brandId] : []);
        setSelectedCollections(Array.from(new Set(collectionIds)));
    }, [location.search]);

    const itemsPerPage = 12; // Adjusted to a better grid number
    const currentWatches = Array.isArray(watches) ? watches : [];

    // Initial Filters Fetch (Runs Once)
    useEffect(() => {
        const controller = new AbortController();

        const fetchFilters = async () => {
            try {
                const [bData, cData] = await Promise.all([
                    publicApi.getBrands('watch', { signal: controller.signal }),
                    publicApi.getCollections(undefined, 'watch', { signal: controller.signal })
                ]);
                if (controller.signal.aborted) return;
                setBrands(Array.isArray(bData) ? bData : []);
                setCollections(Array.isArray(cData) ? cData : []);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to fetch filters:", err);
            }
        };
        fetchFilters();

        return () => controller.abort();
    }, []);

    const fetchWatches = async (reset = false) => {
        try {
            if (reset) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const currentCursor = reset ? undefined : (lastCursor || undefined);
            
            const brandId = selectedBrands.length > 0 ? selectedBrands[0] : undefined;
            const collectionIds = selectedCollections.length > 0 ? selectedCollections : undefined;

            const response = await publicApi.getWatches(
                brandId, 
                collectionIds, 
                searchQuery, 
                currentCursor, 
                itemsPerPage,
                isInStockOnly
            );
            
            const nextWatches = Array.isArray(response?.data) ? response.data : [];
            const nextMeta = response?.meta ?? { hasNextPage: false, lastCursor: null };

            if (reset) {
                setWatches(nextWatches);
            } else {
                setWatches(prev => [...prev, ...nextWatches]);
            }
            
            setHasNextPage(Boolean(nextMeta.hasNextPage));
            setLastCursor(nextMeta.lastCursor ?? null);

        } catch (err) {
            console.error("Failed to fetch public watches:", err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Run fetch on mount and whenever filters/search change
    useEffect(() => {
        fetchWatches(true);
    }, [searchQuery, selectedBrands, selectedCollections, isInStockOnly]);

    // Scroll Listener removed for reusable GoToTop component

    // Scroll Listener removed for reusable GoToTop component

    // Sorting Logic (Client-side)
    // useEffect(() => {
    //     let filtered = [...originalWatches];

    //     // Apply sorting
    //     if (sortMethod === 'price-asc') filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    //     if (sortMethod === 'price-desc') filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    //     setWatches(filtered);
    //     setCurrentPage(1);
    // }, [sortMethod, originalWatches, selectedBrands, selectedCollections]);

    // --- Filter Content Render Function (Desktop Sidebar & Mobile Drawer) ---
    const renderFilterContent = () => {
        const toggleBrand = (brandId: string | null) => {
            // When brand selection changes, clear all selected collections
            setSelectedCollections([]);
            setSelectedBrands(prevBrands => {
                if (brandId === null) return [];
                if (prevBrands.includes(brandId)) {
                    return []; // Allow toggle off
                }
                return [brandId];
            });
        };

        const toggleCollection = (collectionId: string) => {
            setSelectedCollections(prev =>
                prev.includes(collectionId) ? prev.filter(id => id !== collectionId) : [...prev, collectionId]
            );
        };

        const visibleCollections = collections.filter(c => selectedBrands.includes(c.brand_id));

        return (
            <div className='pr-4 lg:pr-8 space-y-10 lg:space-y-12'>
                {/* In Stock Filter */}
                <div>
                    <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>{t('common.availability')}</h4>
                    <label className="flex items-center gap-3 cursor-pointer group transition-colors text-gunmetal/60 hover:text-black text-sm">
                        <input
                            type="checkbox"
                            className="accent-gunmetal w-4 h-4"
                            checked={isInStockOnly}
                            onChange={(e) => setIsInStockOnly(e.target.checked)}
                        />
                        {t('common.in_stock')}
                    </label>
                </div>

                {brands.length > 0 && (
                    <div>
                        <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>{t('header.brands')}</h4>
                        <ul className='space-y-4 lg:space-y-3 text-sm font-light max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
                            {brands.map(brand => {
                                const isSelected = selectedBrands.includes(brand.id);
                                return (
                                    <li key={brand.id}>
                                        <label className={`flex items-center gap-3 cursor-pointer group transition-colors ${isSelected ? 'text-black font-medium' : 'text-gunmetal/60 hover:text-black'}`}>
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type='radio'
                                                    name='brand'
                                                    className='sr-only'
                                                    checked={isSelected}
                                                    onClick={() => toggleBrand(brand.id)}
                                                    onChange={() => { }}
                                                />
                                                {/* Outer Circle */}
                                                <div className={`w-4 h-4 rounded-full border transition-all duration-300 ${isSelected ? 'border-gunmetal bg-gunmetal/5' : 'border-gunmetal/20 group-hover:border-gunmetal/40'}`} />
                                                {/* Inner Dot */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            className="absolute w-1.5 h-1.5 rounded-full bg-gunmetal"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {brand.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {selectedBrands.length > 0 && visibleCollections.length > 0 && (
                    <div>
                        <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>{t('header.brands')}</h4>
                        <ul className='space-y-4 lg:space-y-3 text-sm font-light text-gunmetal/80 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
                            {visibleCollections.map(collection => (
                                <li key={collection.id}>
                                    <label className='flex items-center gap-3 cursor-pointer hover:text-black'>
                                        <input
                                            type='checkbox'
                                            className='accent-gunmetal w-4 h-4'
                                            checked={selectedCollections.includes(collection.id)}
                                            onChange={() => toggleCollection(collection.id)}
                                        />
                                        {collection.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Mobile Apply Button */}
                <div className="lg:hidden pt-8 border-t border-gunmetal/10">
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-gunmetal text-white text-xs uppercase tracking-widest py-4 rounded hover:bg-black transition-colors"
                    >
                        {t('collections.applyFilters')} ({selectedBrands.length + selectedCollections.length})
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='pt-24 md:pt-32 pb-24 min-h-screen bg-white relative'>

            {/* --- Page Header --- */}
            {/* Fix: Changed flex layout to stack cleanly on mobile */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 md:mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between lg:items-end gap-4 md:gap-8'>
                <div className="w-full">
                    {/* The Header now spans full width on mobile so the text centers properly */}
                    <div className="flex flex-col items-center lg:items-start">
                        <span className='font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 block mb-2 md:mb-4'>
                            {t('collections.subtitle')}
                        </span>
                        <h1 className='text-4xl md:text-5xl italic text-gunmetal tracking-tight'>
                            {t('collections.title')}
                        </h1>
                    </div>
                </div>
                <p className='text-sm font-light text-gunmetal/60 max-w-md leading-relaxed hidden lg:block'>
                    {t('collections.description')}
                </p>
            </div>

            {/* --- Toolbar (Filters Toggle & Sort) --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-10 border-b border-gunmetal/10 pb-4 md:pb-6 flex justify-between items-center sticky top-20 md:top-24 z-30 bg-white/95 backdrop-blur-md py-4'>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className='flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium hover:text-black transition-colors'
                >
                    <Filter size={16} strokeWidth={1.5} />
                    <span className="hidden sm:inline">{isFilterOpen ? t('collections.hideFilters') : t('collections.showFilters')}</span>
                    <span className="sm:hidden">{t('collections.filter')}</span>
                </button>

                {/* Temporarily hide sort UI */}
                {/* <Dropdown
                    value={sortMethod}
                    onChange={setSortMethod}
                /> */}
            </div>

            {/* --- Main Content Layout --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row'>

                {/* --- Desktop Sidebar Filters --- */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.aside
                            /* 2. Added marginRight animation to perfectly match Tailwind's gap-12 (48px) */
                            initial={{ width: 0, opacity: 0, marginRight: 0 }}
                            animate={{ width: 280, opacity: 1, marginRight: 48 }}
                            exit={{ width: 0, opacity: 0, marginRight: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className='hidden lg:block shrink-0 overflow-hidden'
                        >
                            <div className='w-[280px]'>
                                {renderFilterContent()}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* --- Product Grid --- */}
                {/* 1. Add motion.div and layout here so the container animates its width change smoothly */}
                <div className='flex-1 relative min-h-[400px]'>
                    {isLoading ? (
                        <CollectionsGridSkeleton />
                    ) : (
                        <motion.div
                            key={`${'sortMethod'}-${selectedBrands.join(',')}-${selectedCollections.join(',')}`}
                            initial='hidden'
                            animate='visible'
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 xl:gap-x-8'
                        >
                            {currentWatches.map((watch) => (
                                <motion.div
                                    key={watch.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                    }}
                                >
                                    <WatchItem watch={watch} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* --- Pagination (Load More) --- */}
                    <LoadMore
                        hasNextPage={hasNextPage}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={() => fetchWatches(false)}
                    />
                </div>
            </div>

            {/* --- Mobile Filter Slide-over Drawer --- */}
            {/* This only shows on screens smaller than 'lg' when isFilterOpen is true */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="lg:hidden">
                        {/* Dark backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
                        {/* Sliding drawer from the left */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 w-[85vw] sm:w-[320px] h-[100dvh] bg-white z-50 p-6 sm:p-8 overflow-y-auto flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gunmetal/10">
                                <span className="font-branding text-[12px] tracking-[0.3em] uppercase text-gunmetal">{t('collections.filter')}</span>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 text-gunmetal/60 hover:text-black">
                                    <X size={20} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Reuse the filter content */}
                            <div className="flex-1">
                                {renderFilterContent()}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Go to Top Button */}
            <GoToTop />
        </div>
    );
};

export default CollectionsPage;
