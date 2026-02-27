import OurStory from "@/components/home/OurStory";
import VideoCarousel from "@/components/home/VideoCarousel";
import BestBrand from "@/components/home/BestBrand";
import type { VideoSlide } from "@/types";
import SecondBrand from "@/components/home/SecondBrand";
import ThirdBrand from "@/components/home/ThirdBrand";
import Collections from "@/components/home/Collections";
import NewsEvents from "@/components/home/NewsEvents";


function Home() {
    const videos: VideoSlide[] = [
        { id: 1, url: './patek_philippe.mp4', title: `THE ART OF\nPRECISION`, description: 'Where watchmaking meets Haute Joaillerie. Our gemsetters practice an extremely delicate art, which requires skills that are further refined over time.' },
        { id: 2, url: './rolex.mp4', title: 'ROLEX LAND-DWELLER\nOPENING NEW HORIZONS', description: 'Rolex begins a new chapter in its history with the Oyster Perpetual Land-Dweller. This most contemporary watch represents the culmination of the brand’s expertise today, fruit of more than a century of experience in watchmaking. The Land-Dweller is designed for those who build their own destinies, seeing opportunity in every moment.' },
        { id: 3, url: './cartier.mp4', title: 'PANTHÈRE\nDE CARTIER WATCH', description: 'Designed in the 1980s, the Panthère de Cartier watch takes its name from the bracelet of the same name. Its ultra-flexible structure echoes the movements of the Maison’s emblematic animal. Both a watch and a piece of jewelry, it is a veritable fashion icon for women with bold style.' },
    ];

    return (
        <div>
            <VideoCarousel videos={videos} />
            <OurStory />
            <BestBrand />
            <SecondBrand />
            <ThirdBrand />
            <Collections />
            <NewsEvents />
        </div>
    );
}

export default Home;
