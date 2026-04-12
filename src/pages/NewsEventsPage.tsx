import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { publicApi } from '../lib/api';
import type { PublicArticle } from '../lib/api';

const NewsEventsPage: React.FC = () => {
    const [articles, setArticles] = useState<PublicArticle[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        publicApi.getArticles()
            .then(data => setArticles(data))
            .catch(err => console.error("Failed to fetch articles:", err))
            .finally(() => setLoading(false));
    }, []);

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];

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

    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

    return (
        <div className="bg-white text-gunmetal overflow-hidden selection:bg-gunmetal selection:text-white">

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
                    <span className="font-branding text-[16vw] leading-none tracking-tighter text-stone-50 font-bold opacity-50">
                        JOURNAL
                    </span>
                </div>

                <motion.div
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

            {/* News & Events Grid */}
            <section className="py-20 md:py-32 px-6 lg:px-12 max-w-[1600px] mx-auto z-10 relative bg-white min-h-[40vh]">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 rounded-full border-b-2 border-gunmetal animate-spin"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center text-stone-400 py-20 font-serif italic text-xl">
                        No articles published yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                        {articles.map((item, index) => (
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
                                            Read Article
                                            <span className="h-[1px] w-6 bg-gunmetal/30 group-hover:bg-gunmetal group-hover:w-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};

export default NewsEventsPage;
