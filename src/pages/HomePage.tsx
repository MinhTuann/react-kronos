import { useState, useEffect } from 'react';
import type { Watch } from '@/types';
import { BestBrand, InStocks, NewsEvents, OurStory, SecondBrand, ThirdBrand, VideoCarousel } from '@/components/home';
import { publicApi } from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { createOrganizationJsonLd, useSeo } from '@/seo';

const HomePage = () => {
    const [inStockWatches, setInStockWatches] = useState<Watch[]>([]);
    const [homeData, setHomeData] = useState<any>({ slides: [], news: [], sections: {} });
    const [isLoading, setIsLoading] = useState(true);
    const { i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;

    useSeo({
        pageKey: 'home',
        lang: currentLang,
        type: 'website',
        structuredData: createOrganizationJsonLd(null, currentLang, origin),
    });

    useEffect(() => {
        const controller = new AbortController();

        const fetchAll = async () => {
            try {
                const [inStock, home] = await Promise.all([
                    publicApi.getInStockWatches({ signal: controller.signal }),
                    publicApi.getHomePageData({ signal: controller.signal })
                ]);

                let news = home.news || [];
                // If homepage didn't return news, fetch latest articles
                if (news.length === 0) {
                    const articles = await publicApi.getArticles(undefined, undefined, { signal: controller.signal });
                    news = articles.data.slice(0, 3);
                }

                // Map backend video_url to url for VideoCarousel
                const mappedSlides = home.slides?.map((slide: any) => ({
                    ...slide,
                    url: slide.video_url,
                    thumbnail_url: slide.thumbnail_url,
                })) || [];

                if (controller.signal.aborted) return;

                setInStockWatches(inStock);
                setHomeData({ ...home, slides: mappedSlides, news });
            } catch (error) {
                if (controller.signal.aborted) return;
                console.error('Failed to fetch home page data:', error);
            } finally {
                if (controller.signal.aborted) return;
                setIsLoading(false);
            }
        };
        fetchAll();

        return () => controller.abort();
    }, []);

    return (
        <div>
            {isLoading ? (
                <div className="space-y-20 pb-20">
                    <VideoCarousel isLoading={true} />
                    <InStocks isLoading={true} />
                    <BestBrand isLoading={true} />
                    <NewsEvents isLoading={true} />
                </div>
            ) : (
                <>
                    {homeData.slides?.length > 0 && <VideoCarousel videos={homeData.slides} />}
                    <InStocks watches={inStockWatches} />
                    <BestBrand watch={homeData.sections?.best_brand} />
                    <SecondBrand watch={homeData.sections?.second_brand} />
                    <ThirdBrand watch={homeData.sections?.third_brand} />
                    <OurStory data={homeData.sections?.our_story} />
                    <NewsEvents news={homeData.news} />
                </>
            )}
        </div>
    );
}

export default HomePage;
