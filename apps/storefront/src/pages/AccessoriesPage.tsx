import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoToTop, LoadMore } from '@/components/app';
import type { Accessory } from '@/types';
import { AccessoryItem } from '@/components/home/InStocks';
import { CollectionsGridSkeleton } from '@/components/common/Skeleton';

import { publicApi } from '@/lib/api';
import type { PublicBrand, PublicCollection, PublicAccessoryType } from '@/lib/api';
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

const AccessoriesPage: React.FC = () => {
    // States
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const { t, i18n } = useTranslation();
    const [hasNextPage, setHasNextPage] = useState(false);
    const [lastCursor, setLastCursor] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(new URLSearchParams(window.location.search).get('in_stock') === 'true');

    // Search Query parsing
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || undefined;

    // Filter States
    const [brands, setBrands] = useState<PublicBrand[]>([]);
    const [collections, setCollections] = useState<PublicCollection[]>([]);
    const [accessoryTypes, setAccessoryTypes] = useState<PublicAccessoryType[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const [selectedAccessoryTypes, setSelectedAccessoryTypes] = useState<string[]>([]);
    const [isInStockOnly, setIsInStockOnly] = useState(queryParams.get('in_stock') === 'true');

    const isFilterInvalid = (() => {
        if (brands.length === 0 && collections.length === 0) return false;

        const params = new URLSearchParams(location.search);
        const brandName = params.get('brandName') || params.get('brand_name');
        const brandId = params.get('brandId') || params.get('brand_id');
        const collectionNames = [
            ...readMultiValueParam(params, 'collectionName'),
            ...readMultiValueParam(params, 'collection_name'),
        ];
        const collectionIds = [
            ...readMultiValueParam(params, 'collections'),
            ...readMultiValueParam(params, 'collectionId'),
            ...readMultiValueParam(params, 'collection_ids'),
        ];

        if (brandName && brands.length > 0) {
            const found = brands.some(b => b.name.toLowerCase() === brandName.toLowerCase());
            if (!found) return true;
        }
        if (brandId && brands.length > 0) {
            const found = brands.some(b => b.id === brandId);
            if (!found) return true;
        }

        if (collectionNames.length > 0 && collections.length > 0) {
            const allFound = collectionNames.every(name => collections.some(c => c.name.toLowerCase() === name.toLowerCase()));
            if (!allFound) return true;
        }
        if (collectionIds.length > 0 && collections.length > 0) {
            const allFound = collectionIds.every(id => collections.some(c => c.id === id));
            if (!allFound) return true;
        }

        return false;
    })();

    const currentLang = i18n.language.split('-')[0];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const selectedBrandName = brands.find((brand) => brand.id === selectedBrands[0])?.name;
    const selectedCollectionNames = collections
        .filter((collection) => selectedCollections.includes(collection.id))
        .map((collection) => collection.name);
    const hasFacetFilters = selectedBrands.length > 0 || selectedCollections.length > 0;
    const shouldNoindex = Boolean(searchQuery) || hasFacetFilters;
    const dynamicFacetLabel = searchQuery
        ? (currentLang === 'en' ? `Search: ${searchQuery}` : `Tìm kiếm: ${searchQuery}`)
        : selectedCollectionNames.length > 0
            ? selectedCollectionNames.join(', ')
            : selectedBrandName;
    const seoTitle = searchQuery
        ? (currentLang === 'en'
            ? `Search results for "${searchQuery}" accessories`
            : `Kết quả tìm kiếm phụ kiện cho "${searchQuery}"`)
        : selectedCollectionNames.length > 0
            ? (currentLang === 'en'
                ? `${selectedCollectionNames.join(', ')} accessories`
                : `Phụ kiện ${selectedCollectionNames.join(', ')}`)
            : selectedBrandName
                ? (currentLang === 'en'
                    ? `${selectedBrandName} accessories`
                    : `Phụ kiện ${selectedBrandName}`)
                : (currentLang === 'en' ? 'Accessories' : 'Phụ kiện');
    const seoDescription = searchQuery
        ? (currentLang === 'en'
            ? `Browse Kronos accessory search results for ${searchQuery}, including curated luxury items and available inventory.`
            : `Xem kết quả tìm kiếm tại Kronos cho từ khóa ${searchQuery}, bao gồm những mẫu phụ kiện cao cấp đang sẵn có.`)
        : selectedCollectionNames.length > 0
            ? (currentLang === 'en'
                ? `Explore ${selectedCollectionNames.join(', ')} accessories at Kronos, with refined selection details and current availability.`
                : `Khám phá phụ kiện ${selectedCollectionNames.join(', ')} tại Kronos với tuyển chọn tinh tế và tình trạng sẵn có hiện tại.`)
            : selectedBrandName
                ? (currentLang === 'en'
                    ? `Discover ${selectedBrandName} accessories curated by Kronos, from iconic references to available collector pieces.`
                    : `Khám phá phụ kiện ${selectedBrandName} được Kronos tuyển chọn, từ những mẫu biểu tượng đến các chiếc dành cho nhà sưu tập.`)
                : (currentLang === 'en'
                    ? 'Explore our curated collection of luxury accessories, including straps, travel cases, and more.'
                    : 'Khám phá bộ sưu tập phụ kiện xa xỉ được tuyển chọn của chúng tôi, bao gồm dây đeo, hộp đựng du lịch và nhiều hơn nữa.');

    const breadcrumbItems = [
        { name: currentLang === 'en' ? 'Home' : 'Trang chủ', path: '/' },
        { name: currentLang === 'en' ? 'Accessories' : 'Phụ kiện', path: '/accessories' },
        ...(dynamicFacetLabel ? [{ name: dynamicFacetLabel, path: `${location.pathname}${location.search}` }] : []),
    ];

    useSeo({
        pageKey: 'collections',
        lang: currentLang,
        title: seoTitle,
        description: seoDescription,
        canonicalPath: '/accessories',
        noindex: shouldNoindex,
        structuredData: createBreadcrumbJsonLd(origin, breadcrumbItems),
    });

    useEffect(() => {
        const resolveParams = async () => {
            const params = new URLSearchParams(location.search);
            let brandId = params.get('brandId') || params.get('brand_id');
            const brandName = params.get('brandName') || params.get('brand_name');

            if (!brandId && brandName && brands.length > 0) {
                const found = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
                if (found) {
                    brandId = found.id;
                }
            }

            let collectionIds = [
                ...readMultiValueParam(params, 'collections'),
                ...readMultiValueParam(params, 'collectionId'),
                ...readMultiValueParam(params, 'collection_ids'),
            ];

            const collectionNames = [
                ...readMultiValueParam(params, 'collectionName'),
                ...readMultiValueParam(params, 'collection_name'),
            ];

            if (collectionNames.length > 0 && collections.length > 0) {
                const mappedIds = collectionNames.map(name => {
                    const found = collections.find(c => c.name.toLowerCase() === name.toLowerCase());
                    return found ? found.id : null;
                }).filter(Boolean) as string[];

                if (mappedIds.length > 0) {
                    collectionIds = Array.from(new Set([...collectionIds, ...mappedIds]));
                }
            }

            const typeIds = [
                ...readMultiValueParam(params, 'types'),
                ...readMultiValueParam(params, 'typeId'),
                ...readMultiValueParam(params, 'accessory_type_ids'),
            ];

            await Promise.resolve();

            setSelectedBrands(brandId ? [brandId] : []);
            setSelectedCollections(Array.from(new Set(collectionIds)));
            setSelectedAccessoryTypes(Array.from(new Set(typeIds)));
        };

        resolveParams();
    }, [location.search, brands, collections]);

    const itemsPerPage = 12;
    const currentAccessories = Array.isArray(accessories) ? accessories : [];

    // Initial Filters Fetch (Runs Once)
    useEffect(() => {
        const controller = new AbortController();

        const fetchFilters = async () => {
            try {
                const [bData, cData, tData] = await Promise.all([
                    publicApi.getBrands('accessory', { signal: controller.signal }),
                    publicApi.getCollections(undefined, 'accessory', { signal: controller.signal }),
                    publicApi.getAccessoryTypes({ signal: controller.signal })
                ]);
                if (controller.signal.aborted) return;
                setBrands(Array.isArray(bData) ? bData : []);
                setCollections(Array.isArray(cData) ? cData : []);
                setAccessoryTypes(Array.isArray(tData) ? tData : []);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error('Failed to fetch filters:', err);
            }
        };
        fetchFilters();

        return () => controller.abort();
    }, []);

    const fetchAccessories = async (reset = false) => {
        await Promise.resolve();
        if (isFilterInvalid) {
            setAccessories([]);
            setHasNextPage(false);
            setLastCursor(null);
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
        }
        try {
            if (reset) {
                setIsLoading(true);
            } else {
                setIsLoadingMore(true);
            }

            const currentCursor = reset ? undefined : (lastCursor || undefined);

            const brandId = selectedBrands.length > 0 ? selectedBrands[0] : undefined;
            const collectionIds = selectedCollections.length > 0 ? selectedCollections : undefined;
            const typeIds = selectedAccessoryTypes.length > 0 ? selectedAccessoryTypes : undefined;

            const response = await publicApi.getAccessories(
                brandId,
                collectionIds,
                typeIds,
                searchQuery,
                currentCursor,
                itemsPerPage,
                isInStockOnly
            );

            const nextAccessories = Array.isArray(response?.data) ? response.data : [];
            const nextMeta = response?.meta ?? { hasNextPage: false, lastCursor: null };

            if (reset) {
                setAccessories(nextAccessories);
            } else {
                setAccessories(prev => [...prev, ...nextAccessories]);
            }

            setHasNextPage(Boolean(nextMeta.hasNextPage));
            setLastCursor(nextMeta.lastCursor ?? null);

        } catch (err) {
            console.error('Failed to fetch public accessories:', err);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    };

    // Run fetch on mount and whenever filters/search change
    useEffect(() => {
        const load = async () => {
            await fetchAccessories(true);
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, selectedBrands, selectedCollections, selectedAccessoryTypes, isInStockOnly, isFilterInvalid]);

    // --- Filter Content Render Function ---
    const renderFilterContent = () => {
        const toggleBrand = (brandId: string | null) => {
            setSelectedCollections([]);
            setSelectedBrands(prevBrands => {
                if (brandId === null) return [];
                if (prevBrands.includes(brandId)) {
                    return [];
                }
                return [brandId];
            });
        };

        const toggleCollection = (collectionId: string) => {
            setSelectedCollections(prev =>
                prev.includes(collectionId) ? prev.filter(id => id !== collectionId) : [...prev, collectionId]
            );
        };

        const toggleType = (typeId: string) => {
            setSelectedAccessoryTypes(prev =>
                prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
            );
        };

        const visibleCollections = collections.filter(c => selectedBrands.includes(c.brand_id));

        return (
            <div className="pr-4 lg:pr-8 space-y-10 lg:space-y-12">
                {/* In Stock Filter */}
                <div>
                    <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4">{t('common.availability')}</h4>
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

                {accessoryTypes.length > 0 && (
                    <div>
                        <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4">{t('collections.accessoryTypes')}</h4>
                        <ul className="space-y-4 lg:space-y-3 text-sm font-light text-gunmetal/80 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {accessoryTypes.map(type => (
                                <li key={type.id}>
                                    <label className="flex items-center gap-3 cursor-pointer hover:text-black">
                                        <input
                                            type="checkbox"
                                            className="accent-gunmetal w-4 h-4"
                                            checked={selectedAccessoryTypes.includes(type.id)}
                                            onChange={() => toggleType(type.id)}
                                        />
                                        {currentLang === 'en' && type.name_en ? type.name_en : type.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {brands.length > 0 && (
                    <div>
                        <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4">{t('header.brands')}</h4>
                        <ul className="space-y-4 lg:space-y-3 text-sm font-light max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {brands.map(brand => {
                                const isSelected = selectedBrands.includes(brand.id);
                                return (
                                    <li key={brand.id}>
                                        <label className={`flex items-center gap-3 cursor-pointer group transition-colors ${isSelected ? 'text-black font-medium' : 'text-gunmetal/60 hover:text-black'}`}>
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="brand"
                                                    className="sr-only"
                                                    checked={isSelected}
                                                    onClick={() => toggleBrand(brand.id)}
                                                    onChange={() => { }}
                                                />
                                                <div className={`w-4 h-4 rounded-full border transition-all duration-300 ${isSelected ? 'border-gunmetal bg-gunmetal/5' : 'border-gunmetal/20 group-hover:border-gunmetal/40'}`} />
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
                        <h4 className="text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4">{t('header.collections')}</h4>
                        <ul className="space-y-4 lg:space-y-3 text-sm font-light text-gunmetal/80 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                            {visibleCollections.map(collection => (
                                <li key={collection.id}>
                                    <label className="flex items-center gap-3 cursor-pointer hover:text-black">
                                        <input
                                            type="checkbox"
                                            className="accent-gunmetal w-4 h-4"
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
                <div className="lg:hidden pt-8 border-t border-gunmetal/10">
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-gunmetal text-white text-xs uppercase tracking-widest py-4 rounded hover:bg-black transition-colors"
                    >
                        {t('collections.applyFilters')} ({selectedBrands.length + selectedCollections.length + selectedAccessoryTypes.length})
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-white relative">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 md:mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between lg:items-end gap-4 md:gap-8">
                <div className="w-full">
                    <div className="flex flex-col items-center lg:items-start">
                        <span className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 block mb-2 md:mb-4">
                            {currentLang === 'en' ? 'Refined Accessories' : 'Phụ kiện tinh chọn'}
                        </span>
                        <h1 className="text-4xl md:text-5xl italic text-gunmetal tracking-tight">
                            {currentLang === 'en' ? 'The Accessories' : 'Phụ Kiện'}
                        </h1>
                    </div>
                </div>
                <p className="text-sm font-light text-gunmetal/60 max-w-md leading-relaxed hidden lg:block">
                    {currentLang === 'en'
                        ? 'Enhance your collection with our curated range of luxury watch accessories, from premium straps to protective cases.'
                        : 'Nâng tầm bộ sưu tập của bạn với các loại phụ kiện đồng hồ xa xỉ, từ dây đeo cao cấp đến hộp đựng bảo quản.'}
                </p>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-10 border-b border-gunmetal/10 pb-4 md:pb-6 flex justify-between items-center sticky top-20 md:top-24 z-30 bg-white/95 backdrop-blur-md py-4">
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium hover:text-black transition-colors"
                >
                    <Filter size={16} strokeWidth={1.5} />
                    <span className="hidden sm:inline">{isFilterOpen ? t('collections.hideFilters') : t('collections.showFilters')}</span>
                    <span className="sm:hidden">{t('collections.filter')}</span>
                </button>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row">
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0, marginRight: 0 }}
                            animate={{ width: 280, opacity: 1, marginRight: 48 }}
                            exit={{ width: 0, opacity: 0, marginRight: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="hidden lg:block shrink-0 overflow-hidden"
                        >
                            <div className="w-[280px]">
                                {renderFilterContent()}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                <div className="flex-1 relative min-h-[400px]">
                    {isLoading ? (
                        <CollectionsGridSkeleton />
                    ) : isFilterInvalid || currentAccessories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <h3 className="text-xl italic text-gunmetal mb-2">
                                {currentLang === 'en' ? 'No items found' : 'Không tìm thấy sản phẩm'}
                            </h3>
                            <p className="text-sm font-light text-stone-400">
                                {currentLang === 'en' 
                                    ? 'Try adjusting your filters or browse our other collections.' 
                                    : 'Vui lòng thử điều chỉnh bộ lọc hoặc khám phá các bộ sưu tập khác.'}
                            </p>
                        </div>
                    ) : (
                        <motion.div
                            key={`${selectedBrands.join(',')}-${selectedCollections.join(',')}`}
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 xl:gap-x-8"
                        >
                            {currentAccessories.map((accessory) => (
                                <motion.div
                                    key={accessory.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                    }}
                                >
                                    <AccessoryItem accessory={accessory} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <LoadMore
                        hasNextPage={hasNextPage}
                        isLoadingMore={isLoadingMore}
                        onLoadMore={() => fetchAccessories(false)}
                    />
                </div>
            </div>

            <AnimatePresence>
                {isFilterOpen && (
                    <div className="lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
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
                            <div className="flex-1">
                                {renderFilterContent()}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <GoToTop />
        </div>
    );
};

export default AccessoriesPage;
