import OurStory from "@/components/home/OurStory";
import VideoCarousel from "@/components/home/VideoCarousel";
import BestBrand from "@/components/home/BestBrand";
import type { VideoSlide, WatchItem } from "@/types";
import SecondBrand from "@/components/home/SecondBrand";
import ThirdBrand from "@/components/home/ThirdBrand";
import NewsEvents from "@/components/home/NewsEvents";
import InStocks from "@/components/home/InStocks";

function Home() {
    const videos: VideoSlide[] = [
        { id: 1, url: './patek_philippe.mp4', title: `THE ART OF\nPRECISION`, description: 'Where watchmaking meets Haute Joaillerie. Our gemsetters practice an extremely delicate art, which requires skills that are further refined over time.' },
        { id: 2, url: './rolex.mp4', title: 'ROLEX LAND-DWELLER\nOPENING NEW HORIZONS', description: 'Rolex begins a new chapter in its history with the Oyster Perpetual Land-Dweller. This most contemporary watch represents the culmination of the brand’s expertise today, fruit of more than a century of experience in watchmaking. The Land-Dweller is designed for those who build their own destinies, seeing opportunity in every moment.' },
        { id: 3, url: './cartier.mp4', title: 'PANTHÈRE\nDE CARTIER WATCH', description: 'Designed in the 1980s, the Panthère de Cartier watch takes its name from the bracelet of the same name. Its ultra-flexible structure echoes the movements of the Maison’s emblematic animal. Both a watch and a piece of jewelry, it is a veritable fashion icon for women with bold style.' },
    ];

    const watches: WatchItem[] = [
        { id: 1, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271/12P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 12105300000, image: 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif', description: 'A jewelry version of a Patek Philippe classic, this platinum perpetual calendar chronograph is lit up by a setting of baguette-cut rubies on the bezel, lugs and folding clasp. The intense color of the stones is echoed by the lacquered red dial with black-gradient rim as well as by the shiny black alligator strap with contrasting red stitching.' },
        { id: 2, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5327G-001', name: 'Perpetual Calendar', color: 'White Gold', price: 3541000000, image: 'https://thekronos.vn/public/uploads/product/i6Hz_5105-51891.avif', description: "Equipped with the famous ultra-thin self-winding Caliber 240 Q, this perpetual calendar is distinguished by its round Calatrava-style case with scalloped flanks accentuating the watch's elegant silhouette. The white gold version features a sunburst blue dial with applied Breguet numerals, adding a dynamic touch." },
        { id: 3, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 9958700000, image: 'https://thekronos.vn/public/uploads/product/l4i9_202321-51891.avif', description: "Heir to a classic launched in 1941, this perpetual calendar chronograph is one of Patek Philippe's most prized complication combinations. The aesthetic harmony of this platinum version set with baguette-cut diamonds is complemented by a lacquered black dial. The manually wound movement combines traditional construction with six patented innovations." },
        { id: 4, brand: 'Patek Philippe', collection: 'Complication', ref: '5231G-001', name: 'World Time. Rare Handcrafts.', color: 'White Gold', price: 3152000000, image: 'https://thekronos.vn/public/uploads/product/jzbj_202402-51891.avif', description: "Patek Philippe pays tribute to the dynamism of Southeast Asia and Oceania in a white gold Rare Handcrafts World Time with a cloisonné Grand Feu enamel map representing that part of the world. The ultra-thin self-winding movement driving a city disk and a 24-hour disk with day/night zones enables the time to be read at will in all 24 time zones." },
        { id: 5, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271/12P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 12105300000, image: 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif', description: 'A jewelry version of a Patek Philippe classic, this platinum perpetual calendar chronograph is lit up by a setting of baguette-cut rubies on the bezel, lugs and folding clasp. The intense color of the stones is echoed by the lacquered red dial with black-gradient rim as well as by the shiny black alligator strap with contrasting red stitching.' },
        { id: 6, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5327G-001', name: 'Perpetual Calendar', color: 'White Gold', price: 3541000000, image: 'https://thekronos.vn/public/uploads/product/i6Hz_5105-51891.avif', description: "Equipped with the famous ultra-thin self-winding Caliber 240 Q, this perpetual calendar is distinguished by its round Calatrava-style case with scalloped flanks accentuating the watch's elegant silhouette. The white gold version features a sunburst blue dial with applied Breguet numerals, adding a dynamic touch." },
        { id: 7, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 9958700000, image: 'https://thekronos.vn/public/uploads/product/l4i9_202321-51891.avif', description: "Heir to a classic launched in 1941, this perpetual calendar chronograph is one of Patek Philippe's most prized complication combinations. The aesthetic harmony of this platinum version set with baguette-cut diamonds is complemented by a lacquered black dial. The manually wound movement combines traditional construction with six patented innovations." },
        { id: 8, brand: 'Patek Philippe', collection: 'Complication', ref: '5231G-001', name: 'World Time. Rare Handcrafts.', color: 'White Gold', price: 3152000000, image: 'https://thekronos.vn/public/uploads/product/jzbj_202402-51891.avif', description: "Patek Philippe pays tribute to the dynamism of Southeast Asia and Oceania in a white gold Rare Handcrafts World Time with a cloisonné Grand Feu enamel map representing that part of the world. The ultra-thin self-winding movement driving a city disk and a 24-hour disk with day/night zones enables the time to be read at will in all 24 time zones." },
    ]

    return (
        <div>
            <VideoCarousel videos={videos} />
            <InStocks watches={watches} />
            <BestBrand />
            <SecondBrand />
            <ThirdBrand />
            <OurStory />
            <NewsEvents />
        </div>
    );
}

export default Home;
