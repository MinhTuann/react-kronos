import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { PublicArticle } from '@/lib/api';
import { NewsCardSkeleton, Skeleton } from '../common/Skeleton';

const NewsItem = ({ item, title, category, summary, t }: { item: PublicArticle, title: string, category: string, summary: string, t: any }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    return (
        <Link to={`/news-events/${item.slug}`} className="group block">
            <div className="aspect-[4/5] overflow-hidden mb-6 bg-stone-100 rounded-sm relative">
                {!imageLoaded && <Skeleton className="absolute inset-0 w-full h-full" />}
                <img 
                    alt={title}
                    className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    src={item.image_url} 
                    onLoad={() => setImageLoaded(true)}
                />
            </div>
            <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-golden font-medium">
                    {category}
                </p>
                <h3 className="text-2xl font-serif italic tracking-tight group-hover:text-golden transition-colors leading-tight">
                    {title}
                </h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed line-clamp-3">
                    {summary}
                </p>
                <span className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gunmetal group-hover:text-golden transition-colors">
                    {t('news.readArticle')}
                    <span className="h-[1px] w-8 bg-gunmetal transition-all duration-500 group-hover:w-12 group-hover:bg-golden" />
                </span>
            </div>
        </Link>
    );
};

const NewsEvents = ({ news, isLoading = false }: { news?: PublicArticle[], isLoading?: boolean }) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language as 'vi' | 'en';

    // Show latest 3 articles
    const displayNews = news?.slice(0, 3) || [];

    if (!isLoading && displayNews.length === 0) return null;

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div className='border-l border-golden pl-4 space-y-2'>
                        <h2 className='font-branding text-lg tracking-widest uppercase text-golden'>{t('news.title')}</h2>
                        <p className='italic tracking-tight text-bone'>{t('news.subtitle')}</p>
                    </div>
                    {!isLoading && (
                        <Link to="/news-events" className="group relative inline-flex justify-center items-center pb-2 text-[10px] tracking-[0.2em] uppercase text-bone font-semibold transition-colors duration-500 hover:text-golden">
                            <span>{t('news.viewAll')}</span>
                            <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-golden transition-all duration-[600ms] ease-out group-hover:w-full" />
                        </Link>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <NewsCardSkeleton key={i} />
                        ))
                    ) : (
                        displayNews.map((item) => {
                            const title = (currentLang === 'en' && item.title_en) ? item.title_en : item.title;
                            const category = (currentLang === 'en' && item.category_en) ? item.category_en : item.category;
                            const summary = ((currentLang === 'en' && item.summary_en) ? item.summary_en : item.summary) || '';

                            return (
                                <NewsItem 
                                    key={item.id} 
                                    item={item} 
                                    title={title} 
                                    category={category} 
                                    summary={summary} 
                                    t={t} 
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}

export default NewsEvents;