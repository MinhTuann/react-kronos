import { useState, useEffect } from 'react';
import type { VideoSlide, Watch } from '@/types';
import { BestBrand, InStocks, NewsEvents, OurStory, SecondBrand, ThirdBrand, VideoCarousel } from '@/components/home';
import { publicApi } from '@/lib/api';

const HomePage = () => {
    const videos: VideoSlide[] = [
        { id: 1, url: './patek_philippe.mp4', title: `THE ART OF\nPRECISION`, description: 'Where watchmaking meets Haute Joaillerie. Our gemsetters practice an extremely delicate art, which requires skills that are further refined over time.' },
        { id: 2, url: './rolex.mp4', title: 'ROLEX LAND-DWELLER\nOPENING NEW HORIZONS', description: 'Rolex begins a new chapter in its history with the Oyster Perpetual Land-Dweller. This most contemporary watch represents the culmination of the brand’s expertise today, fruit of more than a century of experience in watchmaking. The Land-Dweller is designed for those who build their own destinies, seeing opportunity in every moment.' },
        { id: 3, url: './cartier.mp4', title: 'PANTHÈRE\nDE CARTIER WATCH', description: 'Designed in the 1980s, the Panthère de Cartier watch takes its name from the bracelet of the same name. Its ultra-flexible structure echoes the movements of the Maison’s emblematic animal. Both a watch and a piece of jewelry, it is a veritable fashion icon for women with bold style.' },
    ];

    const [inStockWatches, setInStockWatches] = useState<Watch[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInStock = async () => {
            try {
                const data = await publicApi.getInStockWatches();
                setInStockWatches(data);
            } catch (error) {
                console.error('Failed to fetch in-stock watches:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInStock();
    }, []);

    return (
        <div>
            <VideoCarousel videos={videos} />
            {!isLoading && <InStocks watches={inStockWatches} />}
            <BestBrand />
            <SecondBrand />
            <ThirdBrand />
            <OurStory />
            <NewsEvents />
        </div>
    );
}

export default HomePage;
