import { useState, useEffect } from 'react';
import type { Watch } from '@/types';
import { BestBrand, InStocks, NewsEvents, OurStory, SecondBrand, ThirdBrand, VideoCarousel } from '@/components/home';
import { publicApi } from '@/lib/api';

const HomePage = () => {
    const [inStockWatches, setInStockWatches] = useState<Watch[]>([]);
    const [homeData, setHomeData] = useState<any>({ slides: [], news: [], sections: {} });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [inStock, home] = await Promise.all([
                    publicApi.getInStockWatches(),
                    publicApi.getHomePageData()
                ]);
                
                // Map backend video_url to url for VideoCarousel
                const mappedSlides = home.slides?.map((slide: any) => ({
                    ...slide,
                    url: slide.video_url,
                    thumbnail_url: slide.thumbnail_url
                })) || [];

                setInStockWatches(inStock);
                setHomeData({ ...home, slides: mappedSlides });
            } catch (error) {
                console.error('Failed to fetch home page data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div>
            {homeData.slides?.length > 0 && <VideoCarousel videos={homeData.slides} />}
            <InStocks watches={inStockWatches} />
            <BestBrand />
            <SecondBrand />
            <ThirdBrand />
            <OurStory data={homeData.sections?.our_story} />
            <NewsEvents news={homeData.news} />
        </div>
    );
}

export default HomePage;
