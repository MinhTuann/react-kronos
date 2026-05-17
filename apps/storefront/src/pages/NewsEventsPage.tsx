import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { publicApi } from '../lib/api';
import type { PublicArticle } from '../lib/api';
import { GoToTop, LoadMore } from '@/components/app';
import { Skeleton, TextSkeleton } from '@/components/common/Skeleton';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';

// --- Animation Configurations ---
const customEase: Easing = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: customEase } }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const NewsEventsPage: React.FC = () => {
    const [articles, setArticles] = useState<PublicArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [lastCursor, setLastCursor] = useState<string | null>(null);
    const itemsPerPage = 12;

    const fetchArticles = async (reset = false) => {
        try {
            if (reset) setLoading(true);
            else setIsLoadingMore(true);

            const currentCursor = reset ? undefined : (lastCursor || undefined);

            const response = await publicApi.getArticles(currentCursor, itemsPerPage);

            if (reset) {
                setArticles(response.data);
            } else {
                setArticles(prev => [...prev, ...response.data]);
            }

            setHasNextPage(response.meta.hasNextPage);
            setLastCursor(response.meta.lastCursor);
        } catch (err) {
            console.error("Failed to fetch articles:", err);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchArticles(true);
    }, []);

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;

    useSeo({
        pageKey: 'news-events',
        lang: currentLang,
        canonicalPath: '/news-events',
        structuredData: createBreadcrumbJsonLd(origin, [
            { name: currentLang === 'en' ? 'Home' : 'Trang chu', path: '/' },
            { name: currentLang === 'en' ? 'News & Events' : 'Tin tuc & Su kien', path: '/news-events' },
        ]),
    });

    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

    // Extract categories based on current language
    const categories = Array.from(new Set(articles.map(article =>
        currentLang === 'en' ? (article.category_en || article.category) : article.category
    ))).filter(Boolean).sort();

    const filteredArticles = selectedCategory
        ? articles.filter(article => {
            const cat = currentLang === 'en' ? (article.category_en || article.category) : article.category;
            return cat === selectedCategory;
        })
        : articles;

    return (
        <div className="bg-white text-gunmetal selection:bg-gunmetal selection:text-white">

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
                    <span className="font-branding text-[16vw] leading-none tracking-tighter text-stone-50 font-bold opacity-50">
                        JOURNAL
                    </span>
                </div>

                <motion.div
                    key={`${currentLang}-hero`}
                    style={{ y: heroY, opacity: heroOpacity }}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6"
                >
                    <motion.span variants={fadeUp} className="font-branding text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gunmetal/60 mb-6 block">
                        {t('menu.newsEvents')}
                    </motion.span>
                    <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl italic font-serif tracking-tight mb-8 leading-[1.1] text-gunmetal">
                        The Kronos Journal
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-[15px] font-light text-stone-500 leading-relaxed max-w-xl">
                        Discover the latest news, private events, and editorial insights from the world of haute horlogerie.
                    </motion.p>
                </motion.div>
            </section>

            {/* Category Filters Toolbar */}
            {!loading && articles.length > 0 && (
                <div className="sticky top-20 md:top-24 z-30 bg-white/95 backdrop-blur-md py-4 border-b border-gunmetal/10 mb-8 md:mb-12">
                    <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: customEase }}
                            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
                        >
                            <button
                                key={`${currentLang}-cat-all`}
                                onClick={() => setSelectedCategory(null)}
                                className={`font-branding text-[10px] tracking-[0.3em] uppercase transition-all duration-500 relative py-2 ${selectedCategory === null ? 'text-gunmetal font-bold' : 'text-stone-400 hover:text-gunmetal'
                                    }`}
                            >
                                {currentLang === 'en' ? 'ALL' : 'TẤT CẢ'}
                                {selectedCategory === null && (
                                    <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-[1px] bg-gunmetal" />
                                )}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`font-branding text-[10px] tracking-[0.3em] uppercase transition-all duration-500 relative py-2 ${selectedCategory === cat ? 'text-gunmetal font-bold' : 'text-stone-400 hover:text-gunmetal'
                                        }`}
                                >
                                    {cat}
                                    {selectedCategory === cat && (
                                        <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-[1px] bg-gunmetal" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </div>
                </div>
            )}

            {/* News & Events Grid */}
            <section className="pb-20 md:pb-32 px-6 lg:px-12 max-w-[1600px] mx-auto z-10 relative bg-white min-h-[40vh]">

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="space-y-6">
                                <Skeleton className="w-full aspect-[4/3] rounded-sm" />
                                <div className="flex items-center gap-4">
                                    <Skeleton width={80} height={10} />
                                    <Skeleton width={24} height={1} />
                                    <Skeleton width={60} height={12} />
                                </div>
                                <Skeleton width="90%" height={32} />
                                <TextSkeleton lines={3} className="opacity-40" />
                            </div>
                        ))}
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center text-stone-400 py-20 font-serif italic text-xl">
                        {selectedCategory ? t('articles.noResultsForCategory', { category: selectedCategory }) : 'No articles published yet.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {filteredArticles.map((item, index) => (
                            <motion.div
                                key={item.slug || item.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: (index % 2) * 0.2, ease: customEase }}
                            >
                                <Link to={`/news-events/${item.slug || item.id}`} className="group cursor-pointer flex flex-col h-full">
                                    <div className="w-full aspect-[4/3] mb-8 overflow-hidden bg-stone-100 rounded-sm">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={currentLang === 'en' && item.title_en ? item.title_en : item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-stone-200 group-hover:scale-105 transition-transform duration-[2.5s] ease-out"></div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="font-branding text-[10px] tracking-[0.3em] uppercase text-gunmetal font-bold">
                                            {currentLang === 'en' && item.category_en ? item.category_en : item.category}
                                        </span>
                                        <span className="h-[1px] w-6 bg-gunmetal/20"></span>
                                        <span className="text-[13px] text-stone-400 font-light">
                                            {item.date}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl italic font-serif text-gunmetal mb-4 leading-tight group-hover:text-black transition-colors">
                                        {currentLang === 'en' && item.title_en ? item.title_en : item.title}
                                    </h2>
                                    <p className="text-[14px] text-stone-500 font-light leading-relaxed line-clamp-3 mb-6">
                                        {currentLang === 'en' && item.summary_en ? item.summary_en : item.summary}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-branding text-gunmetal group-hover:text-black transition-colors">
                                            {t('news.readArticle')}
                                            <span className="h-[1px] w-6 bg-gunmetal/30 group-hover:bg-gunmetal group-hover:w-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* --- Pagination (Load More) --- */}
                <LoadMore
                    hasNextPage={hasNextPage}
                    isLoadingMore={isLoadingMore}
                    onLoadMore={() => fetchArticles(false)}
                />
            </section>

            {/* Go to Top Button */}
            <GoToTop />
        </div>
    );
};

export default NewsEventsPage;
