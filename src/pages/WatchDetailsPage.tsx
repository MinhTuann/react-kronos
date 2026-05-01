import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Watch } from '@/types';

import { publicApi } from '@/lib/api';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const WatchDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [watch, setWatch] = useState<Watch | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const [isEditorialExpanded, setIsEditorialExpanded] = useState(false);

    useSeo({
        pageKey: 'collections',
        lang: currentLang.split('-')[0],
        title: watch
            ? ((currentLang.startsWith('en') && watch.seo_title_en) ? watch.seo_title_en : watch.seo_title || `${watch.brand} ${watch.name}`)
            : (currentLang.startsWith('en') ? 'Watch Details' : 'Chi tiet dong ho'),
        description: watch
            ? ((currentLang.startsWith('en') && watch.seo_description_en)
                ? watch.seo_description_en
                : watch.seo_description || ((currentLang.startsWith('en') && watch.description_en) ? watch.description_en : watch.description))
            : '',
        image: watch?.seo_image_url || watch?.image,
        canonicalUrl: watch?.canonical_url || undefined,
        canonicalPath: watch?.canonical_url ? undefined : (id ? `/watch/${id}` : '/collections'),
        noindex: watch ? watch.noindex : (!watch && !isLoading),
        type: 'product',
        structuredData: watch ? [
            {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: watch.name,
                description: (currentLang.startsWith('en') && watch.seo_description_en)
                    ? watch.seo_description_en
                    : watch.seo_description || ((currentLang.startsWith('en') && watch.description_en) ? watch.description_en : watch.description),
                image: watch.seo_image_url || watch.image,
                brand: watch.brand,
                sku: watch.ref,
                offers: watch.price ? {
                    '@type': 'Offer',
                    priceCurrency: 'USD',
                    price: watch.price,
                    availability: 'https://schema.org/InStock',
                    url: watch.canonical_url || `${origin}/watch/${id}`,
                } : undefined,
            },
            createBreadcrumbJsonLd(origin, [
                { name: currentLang.startsWith('en') ? 'Home' : 'Trang chu', path: '/' },
                { name: currentLang.startsWith('en') ? 'Collections' : 'Bo suu tap', path: '/collections' },
                { name: watch.name, path: `/watch/${id}` },
            ]),
        ] : undefined,
    });

    useEffect(() => {
        const controller = new AbortController();

        // Scroll to top when page loads
        window.scrollTo(0, 0);

        // Fetch watch details from public API
        const fetchDetails = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await publicApi.getWatchById(id, { signal: controller.signal });
                if (controller.signal.aborted) return;
                setWatch(data);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to load details:", err);
                setWatch(null);
            } finally {
                if (controller.signal.aborted) return;
                setIsLoading(false);
            }
        };

        fetchDetails();

        return () => controller.abort();
    }, [id]);

    if (isLoading) {
        return (
            <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center">
                 <div className="w-8 h-8 border-2 border-gunmetal/20 border-t-gunmetal rounded-full animate-spin" />
            </div>
        );
    }

    if (!watch) {
        return (
            <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="font-branding text-2xl text-gunmetal mb-4">{t('common.watch_not_found')}</h1>
                <Link to="/collections" className="text-sm tracking-widest uppercase text-golden hover:text-black transition-colors border-b border-golden pb-1">
                    {t('common.back_to_collections')}
                </Link>
            </div>
        );
    }

    const rawViewMoreHtml = ((currentLang === 'en' && watch.view_more_content_en) ? watch.view_more_content_en : watch.view_more_content) ?? '';
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
            {/* Breadcrumb Navigation */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-12">
                <nav className="flex items-center text-[10px] uppercase tracking-[0.2em] text-gunmetal/50">
                    <Link to="/" className="hover:text-black transition-colors">{t('header.home')}</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <Link to="/collections" className="hover:text-black transition-colors">{t('header.brands')}</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="text-black font-semibold truncate max-w-[150px] sm:max-w-none">
                        {watch.name}
                    </span>
                </nav>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">

                {/* Left Column - Image Gallery */}
                <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-6">
                    {/* Main Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full flex-1 bg-stone-50 rounded-lg p-12 md:p-24 flex items-center justify-center relative group"
                    >
                        <img
                            src={watch.image}
                            alt={watch.name}
                            className="w-full max-w-[400px] h-auto object-contain drop-shadow-2xl transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                        />
                        {/* Subtle Reflection Effect */}
                        <div className="absolute -bottom-8 w-3/4 h-8 bg-gradient-to-t from-transparent to-black/5 blur-xl rounded-full opacity-50" />
                    </motion.div>
                </div>

                {/* Right Column - Watch Information */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Header Info */}
                        <div className="mb-8 md:mb-12 border-b border-gunmetal/10 pb-8">
                            <span className="font-branding text-xs tracking-[0.4em] uppercase text-golden block mb-4">
                                {watch.brand}
                            </span>
                            <h2 className="text-xl md:text-2xl italic tracking-tight text-gunmetal/70 mb-2">
                                {watch.collection}
                            </h2>
                            <h1 className="text-3xl md:text-5xl font-light text-gunmetal mb-6 leading-tight">
                                {watch.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 mt-6">
                                {watch.price && (
                                    <p className="text-2xl font-serif text-black">
                                        {formatPrice(watch.price)}
                                    </p>
                                )}
                                {watch.ref && (
                                    <p className="font-branding text-sm tracking-[0.2em] font-medium text-gunmetal/50 uppercase border-l border-gunmetal/20 pl-6">
                                        Ref. {watch.ref}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {((currentLang === 'en' && watch.description_en) ? watch.description_en : watch.description) && (
                            <div className="mb-12">
                                <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gunmetal mb-6">{t('common.discovery')}</h3>
                                <p className="text-sm md:text-base font-light text-gunmetal/70 leading-relaxed">
                                    {(currentLang === 'en' && watch.description_en) ? watch.description_en : watch.description}
                                </p>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="mb-12">
                            <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gunmetal mb-6">{t('common.specifics')}</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-gunmetal/10 pt-6">
                                {watch.size && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.caseSize')}</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.size}</p>
                                    </div>
                                )}
                                {(watch.material || watch.color) && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.material')}</p>
                                        <p className="text-sm font-medium text-gunmetal">
                                            {(watch.material || watch.color) ? ((currentLang === 'en' && watch.material_en) ? watch.material_en : watch.material || watch.color) : ''}
                                        </p>
                                    </div>
                                )}
                                {watch.movement && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.movement')}</p>
                                        <p className="text-sm font-medium text-gunmetal">
                                            {(currentLang === 'en' && watch.movement_en) ? watch.movement_en : watch.movement}
                                        </p>
                                    </div>
                                )}
                                {watch.strap && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.strap')}</p>
                                        <p className="text-sm font-medium text-gunmetal">
                                            {(currentLang === 'en' && watch.strap_en) ? watch.strap_en : watch.strap}
                                        </p>
                                    </div>
                                )}
                                {watch.dial && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.dial')}</p>
                                        <p className="text-sm font-medium text-gunmetal">
                                            {(currentLang === 'en' && watch.dial_en) ? watch.dial_en : watch.dial}
                                        </p>
                                    </div>
                                )}
                                {watch.condition && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.condition')}</p>
                                        <p className="text-sm font-medium text-gunmetal">
                                            {(currentLang === 'en' && watch.condition_en) ? watch.condition_en : watch.condition}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.availability')}</p>
                                    <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span>
                                        {t('common.in_stock')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">{t('common.delivery')}</p>
                                    <p className="text-sm font-medium text-gunmetal">{t('common.delivery_time')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button className="flex-1 bg-gunmetal text-white text-xs uppercase tracking-[0.2em] font-semibold py-5 px-8 hover:bg-black transition-colors flex items-center justify-center gap-3">
                                {t('common.add_to_cart')}
                            </button>
                            <button className="flex-1 border border-gunmetal/20 text-gunmetal text-xs uppercase tracking-[0.2em] font-semibold py-5 px-8 hover:bg-stone-50 transition-colors">
                                {t('common.contact_boutiques')}
                            </button>
                        </div>

                        {/* Guarantees */}
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
                <Link to="/collections" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black transition-colors group">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    {t('common.back_to_collections')}
                </Link>
            </div>
        </div>
    );
};

export default WatchDetailsPage;
