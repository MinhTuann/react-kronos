import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { publicApi } from '../lib/api';
import type { PublicArticle } from '../lib/api';
import { Skeleton, TextSkeleton } from '@/components/common/Skeleton';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';

const NewsEventDetailsPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<PublicArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;

    useEffect(() => {
        const controller = new AbortController();
        window.scrollTo(0, 0);

        const fetchDetails = async () => {
            if (!slug) return;
            try {
                setIsLoading(true);
                const data = await publicApi.getArticleBySlug(slug, { signal: controller.signal });
                if (controller.signal.aborted) return;
                setArticle(data);
            } catch (err) {
                if (controller.signal.aborted) return;
                console.error("Failed to load article details:", err);
                setArticle(null);
            } finally {
                if (controller.signal.aborted) return;
                setIsLoading(false);
            }
        };

        fetchDetails();

        return () => controller.abort();
    }, [slug]);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const displayTitle = article
        ? ((currentLang === 'en' && article.title_en) ? article.title_en : article.title)
        : (currentLang === 'en' ? 'Article Not Found' : 'Khong tim thay bai viet');
    const displayDescription = article
        ? ((currentLang === 'en' && article.seo_description_en)
            ? article.seo_description_en
            : (currentLang === 'en' && article.summary_en)
                ? article.summary_en
                : article.seo_description || article.summary || '')
        : '';

    useSeo({
        pageKey: 'news-events',
        lang: currentLang,
        title: article
            ? ((currentLang === 'en' && article.seo_title_en) ? article.seo_title_en : article.seo_title || displayTitle)
            : displayTitle,
        description: displayDescription,
        image: article?.seo_image_url || article?.image_url,
        canonicalUrl: article ? (article.canonical_url || `${origin}/news-events/${slug}`) : undefined,
        canonicalPath: article ? undefined : '/news-events',
        noindex: article ? (article.noindex !== undefined ? article.noindex : true) : true,
        type: article ? 'article' : 'website',
        structuredData: article ? [
            {
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: displayTitle,
                description: displayDescription,
                image: article.seo_image_url || article.image_url,
                datePublished: article.date,
                mainEntityOfPage: article.canonical_url || `${origin}/news-events/${slug}`,
            },
            createBreadcrumbJsonLd(origin, [
                { name: currentLang === 'en' ? 'Home' : 'Trang chu', path: '/' },
                { name: currentLang === 'en' ? 'News & Events' : 'Tin tuc & Su kien', path: '/news-events' },
                { name: displayTitle, path: `/news-events/${slug}` },
            ]),
        ] : undefined,
    });

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen">
                <Skeleton className="w-full h-[60vh] md:h-[80vh]" />
                <div className="max-w-3xl mx-auto px-6 py-20 space-y-6">
                    <div className="flex items-center gap-4 justify-center">
                        <Skeleton width={80} height={10} />
                        <Skeleton width={24} height={1} />
                        <Skeleton width={60} height={10} />
                    </div>
                    <TextSkeleton lines={8} className="opacity-40" />
                    <TextSkeleton lines={6} className="opacity-30 mt-8" />
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center bg-white">
                <h1 className="font-branding text-2xl text-gunmetal mb-4">Article Not Found</h1>
                <Link to="/news-events" className="text-sm tracking-widest uppercase text-golden hover:text-black transition-colors border-b border-golden pb-1">
                    Back to Journal
                </Link>
            </div>
        );
    }

    const displayCategory = (currentLang === 'en' && article.category_en) ? article.category_en : article.category;
    const rawHtml = ((currentLang === 'en' && article.content_en) ? article.content_en : article.content) ?? '';

    /**
     * Sanitize Quill-generated HTML.
     * Root cause: Quill can embed stray \n characters or <br> tags *inside* an
     * inline text run, which the browser renders as a visible line-break mid-word
     * (e.g. "V" then "\u1edbi" on the next line for "V\u1edbi").
     *
     * Fix:
     *  1. Normalize to NFC so composed Vietnamese chars are single code-points.
     *  2. Remove naked newlines that appear between two non-whitespace chars
     *     (these are NOT intentional paragraph breaks - they are Quill artefacts).
     */
    const sanitizeQuillHtml = (html: string): string => {
        // 1. Unicode normalize to composed form (NFC)
        let clean = html.normalize('NFC');
        // 2. THE ROOT CAUSE: Quill saves &nbsp; between words instead of regular
        //    spaces. The browser treats &nbsp; as non-breaking, preventing all
        //    word-wrap. Replace with standard ASCII space.
        clean = clean.replace(/&nbsp;/g, ' ');
        // 3. Strip newline characters sandwiched between non-space chars (mid-word breaks)
        clean = clean.replace(/(\S)\n(\S)/g, '$1$2');
        return clean;
    };

    const displayHtml = sanitizeQuillHtml(rawHtml);


    return (
        <div className="bg-white text-gunmetal min-h-screen overflow-hidden selection:bg-gunmetal selection:text-white">

            {/* Header Breadcrumbs */}
            <div className="absolute top-24 md:top-32 left-0 right-0 z-20 max-w-[1600px] mx-auto px-6 lg:px-12">
                <nav className="flex items-center text-[10px] uppercase tracking-[0.2em] text-white mix-blend-difference drop-shadow-md">
                    <Link to="/" className="hover:text-stone-300 transition-colors">{t('header.home')} / JOURNAL</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <Link to="/news-events" className="hover:text-stone-300 transition-colors uppercase">{displayCategory}</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="font-semibold truncate max-w-[150px] sm:max-w-none">
                        {displayTitle}
                    </span>
                </nav>
            </div>

            {/* Cinematic Hero Image */}
            <section ref={heroRef} className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-stone-900">
                <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-full">
                    {article.image_url ? (
                        <img
                            src={article.image_url}
                            alt={displayTitle}
                            className="w-full h-full object-cover opacity-80"
                        />
                    ) : (
                        <div className="w-full h-full bg-gunmetal"></div>
                    )}
                </motion.div>

                {/* Gradient overlays to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="absolute inset-0 flex flex-col justify-end items-center text-center px-6 pb-20 md:pb-32 z-10"
                >
                     <motion.div
                         initial={{ opacity: 0, y: 30 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.8, delay: 0.2 }}
                     >
                        <span className="font-branding text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-stone-300 mb-4 block">
                            {displayCategory}
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-7xl italic font-serif tracking-tight mb-6 leading-[1.1] text-white max-w-5xl mx-auto drop-shadow-lg">
                            {displayTitle}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-stone-300">
                            <span className="h-[1px] w-8 bg-stone-300/50"></span>
                            <span className="text-[13px] font-light tracking-wide uppercase">
                                {article.date}
                            </span>
                            <span className="h-[1px] w-8 bg-stone-300/50"></span>
                        </div>
                     </motion.div>
                </motion.div>
            </section>

            {/* Article Content */}
            <section className="py-20 md:py-32 px-6 lg:px-12 z-10 relative bg-white">
                <motion.div
                    className="max-w-3xl mx-auto min-w-0"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Rich Text Formatted Content */}
                    <article
                        lang={currentLang}
                        className="prose prose-stone prose-lg md:prose-xl max-w-none
                        prose-headings:font-serif prose-headings:italic prose-headings:font-light prose-headings:tracking-tight
                        prose-p:font-light prose-p:leading-relaxed prose-p:text-stone-500
                        prose-a:text-golden prose-a:no-underline hover:prose-a:text-gunmetal"
                        dangerouslySetInnerHTML={{ __html: displayHtml }}
                    />
                </motion.div>

                {/* Back Navigation Footer */}
                <div className="mt-32 pt-12 border-t border-gunmetal/10 text-center">
                    <Link to="/news-events" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black transition-colors group">
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Back to Journal
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default NewsEventDetailsPage;
