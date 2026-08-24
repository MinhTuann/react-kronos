import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SpecValue from '@/components/common/SpecValue';
import { Skeleton, TextSkeleton } from '@/components/common/Skeleton';
import type { Accessory } from '@/types';

import { publicApi } from '@/lib/api';
import { useImageLoadState } from '@/lib/useImageLoadState';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const AccessoryDetailsPage: React.FC = () => {
    const { id, brand_slug, collection_slug, ref } = useParams<{
        id?: string;
        brand_slug?: string;
        collection_slug?: string;
        ref?: string
    }>();
    const [accessory, setAccessory] = useState<Accessory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const detailPath = id
        ? `/accessory/${id}`
        : `/accessory/${brand_slug}/${collection_slug ? `${collection_slug}/` : ''}${ref}`;
    const [isEditorialExpanded, setIsEditorialExpanded] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const activeImageSrc = accessory?.images && accessory.images.length > 0
        ? accessory.images[activeImageIndex]
        : accessory?.image;
    const {
        isReady: isActiveImageLoaded,
        markReady: markActiveImageReady,
    } = useImageLoadState(activeImageSrc, { eager: true });

    useSeo({
        pageKey: 'collections',
        lang: currentLang.split('-')[0],
        title: accessory
            ? ((currentLang.startsWith('en') && accessory.seo_title_en) ? accessory.seo_title_en : accessory.seo_title || `${accessory.brand} ${accessory.name}`)
            : (currentLang.startsWith('en') ? 'Accessory Details' : 'Chi tiết phụ kiện'),
        description: accessory
            ? ((currentLang.startsWith('en') && accessory.seo_description_en)
                ? accessory.seo_description_en
                : accessory.seo_description || ((currentLang.startsWith('en') && accessory.description_en) ? accessory.description_en : accessory.description))
            : '',
        image: accessory?.seo_image_url || accessory?.image,
        canonicalUrl: accessory?.canonical_url || undefined,
        canonicalPath: accessory?.canonical_url ? undefined : (brand_slug && ref ? detailPath : '/accessories'),
        noindex: accessory ? (accessory.noindex !== undefined ? accessory.noindex : true) : (!accessory && !isLoading),
        type: 'product',
        structuredData: accessory ? [
            {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: accessory.name,
                description: (currentLang.startsWith('en') && accessory.seo_description_en)
                    ? accessory.seo_description_en
                    : accessory.seo_description || ((currentLang.startsWith('en') && accessory.description_en) ? accessory.description_en : accessory.description),
                image: accessory.seo_image_url || accessory.image,
                brand: accessory.brand,
                sku: accessory.ref,
                offers: accessory.price ? {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: accessory.price,
                    availability: 'https://schema.org/InStock',
                    url: accessory.canonical_url || `${origin}${detailPath}`,
                } : undefined,
            },
            createBreadcrumbJsonLd(origin, [
                { name: currentLang.startsWith('en') ? 'Home' : 'Trang chủ', path: '/' },
                { name: currentLang.startsWith('en') ? 'Accessories' : 'Phụ kiện', path: '/accessories' },
                {
                    name: accessory.name,
                    path: detailPath,
                },
            ]),
        ] : undefined,
    });

    useEffect(() => {
        const controller = new AbortController();
        window.scrollTo(0, 0);

        const fetchDetails = async () => {
            if (!id && !(brand_slug && ref)) return;
            try {
                setIsLoading(true);
                const data = id
                    ? await publicApi.getAccessoryById(id, { signal: controller.signal })
                    : await publicApi.getAccessoryBySlug(brand_slug!, ref!, collection_slug, { signal: controller.signal });

                if (controller.signal.aborted) return;
                setAccessory(data);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to load details:", err);
                setAccessory(null);
            } finally {
                if (controller.signal.aborted) return;
                setIsLoading(false);
            }
        };

        fetchDetails();

        return () => controller.abort();
    }, [id, brand_slug, collection_slug, ref]);

    if (isLoading) {
        return (
            <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-white">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-12">
                    <div className="flex items-center gap-2">
                        <Skeleton width={40} height={10} />
                        <Skeleton width={10} height={10} variant="circle" />
                        <Skeleton width={60} height={10} />
                        <Skeleton width={10} height={10} variant="circle" />
                        <Skeleton width={100} height={10} />
                    </div>
                </div>
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
                    <div className="w-full lg:w-1/2">
                        <Skeleton className="aspect-square md:aspect-[4/5] w-full rounded-lg" />
                        <div className="flex gap-4 mt-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="w-20 h-20 rounded-md flex-shrink-0" />
                            ))}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="border-b border-gunmetal/10 pb-8 space-y-4">
                            <Skeleton width={100} height={12} />
                            <Skeleton width="60%" height={24} />
                            <Skeleton width="80%" height={48} />
                            <div className="flex gap-6 mt-6">
                                <Skeleton width={100} height={28} />
                                <Skeleton width={120} height={16} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Skeleton width={120} height={12} />
                            <TextSkeleton lines={4} className="opacity-50" />
                        </div>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-gunmetal/10 pt-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton width={60} height={10} />
                                    <Skeleton width={100} height={16} />
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Skeleton className="flex-1 h-14 rounded" />
                            <Skeleton className="flex-1 h-14 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!accessory) {
        return (
            <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="font-branding text-2xl text-gunmetal mb-4">{currentLang.startsWith('en') ? 'Accessory not found' : 'Không tìm thấy phụ kiện'}</h1>
                <Link to="/accessories" className="text-sm tracking-widest uppercase text-golden hover:text-black transition-colors border-b border-golden pb-1">
                    {currentLang.startsWith('en') ? 'Back to accessories' : 'Quay lại phụ kiện'}
                </Link>
            </div>
        );
    }

    const rawViewMoreHtml = ((currentLang.startsWith('en') && accessory.view_more_content_en) ? accessory.view_more_content_en : accessory.view_more_content) ?? '';
    const sanitizeQuillHtml = (html: string): string => {
        let clean = html.normalize('NFC');
        clean = clean.replace(/&nbsp;/g, ' ');
        clean = clean.replace(/(\S)\n(\S)/g, '$1$2');
        return clean;
    };
    const viewMoreHtml = sanitizeQuillHtml(rawViewMoreHtml);
    const hasViewMore = viewMoreHtml.replace(/<[^>]+>/g, '').trim().length > 0;

    return (
        <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-white">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-12">
                <nav className="flex items-center text-[10px] uppercase tracking-[0.2em] text-gunmetal/50">
                    <Link to="/" className="hover:text-black transition-colors">{t('header.home')}</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <Link to="/accessories" className="hover:text-black transition-colors">{currentLang.startsWith('en') ? 'Accessories' : 'Phụ kiện'}</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="text-black font-semibold truncate max-w-[150px] sm:max-w-none">
                        {accessory.name}
                    </span>
                </nav>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    <div className="relative aspect-square md:aspect-[4/5] bg-stone-50 rounded-lg overflow-hidden flex items-center justify-center p-8 md:p-16">
                        {!isActiveImageLoaded && (
                            <div className="absolute inset-0 p-8 md:p-16">
                                <Skeleton className="w-full h-full rounded-lg" />
                            </div>
                        )}
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={activeImageIndex}
                                custom={direction}
                                initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full flex items-center justify-center"
                            >
                                <img
                                    src={activeImageSrc}
                                    alt={`${accessory.name} - View ${activeImageIndex + 1}`}
                                    loading="eager"
                                    decoding="async"
                                    onLoad={markActiveImageReady}
                                    onError={markActiveImageReady}
                                    className={`w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500 ${
                                        isActiveImageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {accessory.images && accessory.images.length > 1 && (
                            <>
                                <button
                                    onClick={() => {
                                        setDirection(-1);
                                        setActiveImageIndex((prev) => (prev === 0 ? accessory.images!.length - 1 : prev - 1));
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gunmetal hover:bg-white transition-colors z-10 shadow-sm"
                                >
                                    <ChevronRight className="rotate-180" size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        setDirection(1);
                                        setActiveImageIndex((prev) => (prev === accessory.images!.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gunmetal hover:bg-white transition-colors z-10 shadow-sm"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-t from-transparent to-black/5 blur-xl rounded-full opacity-50" />
                    </div>

                    {accessory.images && accessory.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {accessory.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setDirection(idx > activeImageIndex ? 1 : -1);
                                        setActiveImageIndex(idx);
                                    }}
                                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-stone-50 border-2 transition-all ${
                                        idx === activeImageIndex ? 'border-golden shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={img} alt={`${accessory.name} thumbnail ${idx}`} className="w-full h-full object-contain p-2" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="mb-8 md:mb-12 border-b border-gunmetal/10 pb-8">
                            <span className="font-branding text-xs tracking-[0.4em] uppercase text-golden block mb-4">
                                {accessory.brand}
                            </span>
                            <h2 className="text-xl md:text-2xl italic tracking-tight text-gunmetal/70 mb-2">
                                {accessory.collection || 'Accessory'}
                            </h2>
                            <h1 className="text-3xl md:text-5xl font-light text-gunmetal mb-6 leading-tight">
                                {accessory.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 mt-6">
                                {accessory.price && (
                                    <p className="text-2xl font-serif text-black">
                                        {formatPrice(accessory.price)}
                                    </p>
                                )}
                                {accessory.ref && (
                                    <p className="font-branding text-sm tracking-[0.2em] font-medium text-gunmetal/50 uppercase border-l border-gunmetal/20 pl-6">
                                        Ref. {accessory.ref}
                                    </p>
                                )}
                            </div>
                        </div>

                        {((currentLang.startsWith('en') && accessory.description_en) ? accessory.description_en : accessory.description) && (
                            <div className="mb-12">
                                <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gunmetal mb-6">{t('common.discovery')}</h3>
                                <p className="text-sm md:text-base font-light text-gunmetal/70 leading-relaxed">
                                    {(currentLang.startsWith('en') && accessory.description_en) ? accessory.description_en : accessory.description}
                                </p>
                            </div>
                        )}

                        <div className="mb-12">
                            <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gunmetal mb-6">{t('common.specifics')}</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-gunmetal/10 pt-6">
                                {accessory.size && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{currentLang.startsWith('en') ? 'Size' : 'Kích thước'}</p>
                                        <p className="text-sm font-medium text-gunmetal">{accessory.size}</p>
                                    </div>
                                )}
                                {accessory.material && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.material')}</p>
                                        <div className="text-sm font-medium text-gunmetal">
                                            <SpecValue value={(currentLang.startsWith('en') && accessory.material_en) ? accessory.material_en : accessory.material} />
                                        </div>
                                    </div>
                                )}

                                {accessory.color && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.color')}</p>
                                        <div className="text-sm font-medium text-gunmetal">
                                            <SpecValue value={(currentLang.startsWith('en') && accessory.color_en) ? accessory.color_en : accessory.color} />
                                        </div>
                                    </div>
                                )}
                                {accessory.condition && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.condition')}</p>
                                        <p className="text-sm font-medium text-gunmetal">
                                            {(currentLang.startsWith('en') && accessory.condition_en) ? accessory.condition_en : accessory.condition}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.availability')}</p>
                                    {accessory.is_in_stock ? (
                                        <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span>
                                            {t('common.in_stock')}
                                        </p>
                                    ) : (
                                        <p className="text-sm font-medium text-amber-700 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 block animate-pulse"></span>
                                            {t('common.pre_order')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button className="w-full border border-gunmetal/20 text-gunmetal text-xs uppercase tracking-[0.2em] font-semibold py-5 px-8 hover:bg-stone-50 transition-colors">
                                {t('common.contact_boutiques')}
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-8 justify-center sm:justify-start">
                            <p className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-gunmetal/60">
                                <ShieldCheck size={14} />
                                {t('common.authenticity')}
                            </p>
                            <p className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-gunmetal/60">
                                <ShieldCheck size={14} />
                                {t('common.secure_payment')}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {hasViewMore && (
                <section className="max-w-[1200px] mx-auto px-6 lg:px-12 mt-24 pt-16">
                    <div className="text-center mb-8 relative">
                        <div className="absolute left-0 top-1/2 -mt-px w-full h-px bg-gunmetal/10 -z-10"></div>
                        <button
                            onClick={() => setIsEditorialExpanded(!isEditorialExpanded)}
                            className="bg-white px-8 uppercase tracking-[0.3em] text-[10px] sm:text-xs font-semibold text-gunmetal hover:text-golden transition-colors inline-flex items-center gap-3 group"
                        >
                            <motion.div
                                animate={{ rotate: isEditorialExpanded ? 180 : 0 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gunmetal/20 flex items-center justify-center group-hover:border-golden transition-colors"
                            >
                                {isEditorialExpanded ? <Minus size={12} /> : <Plus size={12} />}
                            </motion.div>
                            {isEditorialExpanded ? t('common.view_less', 'View Less') : t('common.view_more', 'View More')}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isEditorialExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden"
                            >
                                <div className="pb-16 pt-8 flex justify-center border-b border-gunmetal/10">
                                    <article
                                        lang={currentLang}
                                        className="prose prose-stone prose-lg md:prose-xl max-w-[800px] w-full
                                        prose-headings:font-serif prose-headings:italic prose-headings:font-light prose-headings:tracking-tight
                                        prose-p:font-light prose-p:leading-relaxed prose-p:text-stone-600
                                        prose-li:text-stone-600 prose-strong:text-gunmetal
                                        prose-a:text-golden prose-a:no-underline hover:prose-a:text-gunmetal"
                                        dangerouslySetInnerHTML={{ __html: viewMoreHtml }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            )}

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-24">
                <Link to="/accessories" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black transition-colors group">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    {currentLang.startsWith('en') ? 'Back to accessories' : 'Quay lại phụ kiện'}
                </Link>
            </div>
        </div>
    );
};

export default AccessoryDetailsPage;
