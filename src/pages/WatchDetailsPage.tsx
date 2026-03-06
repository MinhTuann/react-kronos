import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import type { Watch } from '@/types';

// Extended Mock data that combines elements from HomePage and CollectionsPage
const MOCK_WATCHES: Watch[] = [
    { id: 1, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271/12P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 12105300000, image: 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif', description: 'A jewelry version of a Patek Philippe classic, this platinum perpetual calendar chronograph is lit up by a setting of baguette-cut rubies on the bezel, lugs and folding clasp. The intense color of the stones is echoed by the lacquered red dial with black-gradient rim as well as by the shiny black alligator strap with contrasting red stitching.' },
    { id: 2, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5327G-001', name: 'Perpetual Calendar', color: 'White Gold', price: 3541000000, image: 'https://thekronos.vn/public/uploads/product/i6Hz_5105-51891.avif', description: "Equipped with the famous ultra-thin self-winding Caliber 240 Q, this perpetual calendar is distinguished by its round Calatrava-style case with scalloped flanks accentuating the watch's elegant silhouette. The white gold version features a sunburst blue dial with applied Breguet numerals, adding a dynamic touch." },
    { id: 3, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 9958700000, image: 'https://thekronos.vn/public/uploads/product/l4i9_202321-51891.avif', description: "Heir to a classic launched in 1941, this perpetual calendar chronograph is one of Patek Philippe's most prized complication combinations. The aesthetic harmony of this platinum version set with baguette-cut diamonds is complemented by a lacquered black dial. The manually wound movement combines traditional construction with six patented innovations." },
    { id: 4, brand: 'Patek Philippe', collection: 'Complication', ref: '5231G-001', name: 'World Time. Rare Handcrafts.', color: 'White Gold', price: 3152000000, image: 'https://thekronos.vn/public/uploads/product/jzbj_202402-51891.avif', description: "Patek Philippe pays tribute to the dynamism of Southeast Asia and Oceania in a white gold Rare Handcrafts World Time with a cloisonné Grand Feu enamel map representing that part of the world. The ultra-thin self-winding movement driving a city disk and a 24-hour disk with day/night zones enables the time to be read at will in all 24 time zones." },
    { id: 5, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271/12P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 12105300000, image: 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif', description: 'A jewelry version of a Patek Philippe classic, this platinum perpetual calendar chronograph is lit up by a setting of baguette-cut rubies on the bezel, lugs and folding clasp. The intense color of the stones is echoed by the lacquered red dial with black-gradient rim as well as by the shiny black alligator strap with contrasting red stitching.' },
    { id: 6, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5327G-001', name: 'Perpetual Calendar', color: 'White Gold', price: 3541000000, image: 'https://thekronos.vn/public/uploads/product/i6Hz_5105-51891.avif', description: "Equipped with the famous ultra-thin self-winding Caliber 240 Q, this perpetual calendar is distinguished by its round Calatrava-style case with scalloped flanks accentuating the watch's elegant silhouette. The white gold version features a sunburst blue dial with applied Breguet numerals, adding a dynamic touch." },
    { id: 7, brand: 'Patek Philippe', collection: 'Grand Complication', ref: '5271P-010', name: 'Chronograph. Perpetual Calendar. Joaillerie.', color: 'Platinum', price: 9958700000, image: 'https://thekronos.vn/public/uploads/product/l4i9_202321-51891.avif', description: "Heir to a classic launched in 1941, this perpetual calendar chronograph is one of Patek Philippe's most prized complication combinations. The aesthetic harmony of this platinum version set with baguette-cut diamonds is complemented by a lacquered black dial. The manually wound movement combines traditional construction with six patented innovations." },
    { id: 8, brand: 'Patek Philippe', collection: 'Complication', ref: '5231G-001', name: 'World Time. Rare Handcrafts.', color: 'White Gold', price: 3152000000, image: 'https://thekronos.vn/public/uploads/product/jzbj_202402-51891.avif', description: "Patek Philippe pays tribute to the dynamism of Southeast Asia and Oceania in a white gold Rare Handcrafts World Time with a cloisonné Grand Feu enamel map representing that part of the world. The ultra-thin self-winding movement driving a city disk and a 24-hour disk with day/night zones enables the time to be read at will in all 24 time zones." },
];

// Add extra mock watches from the collection page loop if not found (for IDs > 8)
for (let i = 0; i < 24; i++) {
    if (!MOCK_WATCHES.find(w => w.id === i)) {
        MOCK_WATCHES.push({
            id: i,
            brand: 'KRONOS',
            collection: i % 3 === 0 ? 'Grand Complications' : i % 2 === 0 ? 'Nautilus' : 'Calatrava',
            name: `Reference ${5000 + i}`,
            ref: `5000-${i}`,
            color: i % 2 === 0 ? 'Rose Gold' : 'Platinum',
            image: 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif',
            price: 35000 + (i * 1500),
            description: 'A jewelry version of a Patek Philippe classic, this platinum perpetual calendar chronograph is lit up by a setting of baguette-cut rubies on the bezel, lugs and folding clasp. The intense color of the stones is echoed by the lacquered red dial with black-gradient rim as well as by the shiny black alligator strap with contrasting red stitching.',
        });
    }
}

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

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);

        // Find the watch from mock data
        if (id) {
            const found = MOCK_WATCHES.find(w => w.id === parseInt(id));
            if (found) {
                setWatch(found);
            }
        }
    }, [id]);

    if (!watch) {
        return (
            <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="font-branding text-2xl text-gunmetal mb-4">Watch Not Found</h1>
                <Link to="/collections" className="text-sm tracking-widest uppercase text-golden hover:text-black transition-colors border-b border-golden pb-1">
                    Return to Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-white">
            {/* Breadcrumb Navigation */}
            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-12">
                <nav className="flex items-center text-[10px] uppercase tracking-[0.2em] text-gunmetal/50">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <Link to="/collections" className="hover:text-black transition-colors">Collections</Link>
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
                                    <p className="text-sm tracking-[0.2em] font-medium text-gunmetal/50 uppercase border-l border-gunmetal/20 pl-6">
                                        Ref. {watch.ref}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {watch.description && (
                            <div className="mb-12">
                                <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gunmetal mb-6">Discovery</h3>
                                <p className="text-sm md:text-base font-light text-gunmetal/70 leading-relaxed">
                                    {watch.description}
                                </p>
                            </div>
                        )}

                        {/* Specifications */}
                        <div className="mb-12">
                            <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-gunmetal mb-6">Specifics</h3>
                            <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-gunmetal/10 pt-6">
                                {watch.color && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Material</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.color}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Condition</p>
                                    <p className="text-sm font-medium text-gunmetal">Unworn</p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Availability</p>
                                    <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span>
                                        In Stock
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Delivery</p>
                                    <p className="text-sm font-medium text-gunmetal">3-5 Business Days</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                            <button className="flex-1 bg-gunmetal text-white text-xs uppercase tracking-[0.2em] font-semibold py-5 px-8 hover:bg-black transition-colors flex items-center justify-center gap-3">
                                Add to Cart
                            </button>
                            <button className="flex-1 border border-gunmetal/20 text-gunmetal text-xs uppercase tracking-[0.2em] font-semibold py-5 px-8 hover:bg-stone-50 transition-colors">
                                Contact Boutiques
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="mt-8 flex items-center gap-8 justify-center sm:justify-start">
                            <p className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-gunmetal/60">
                                <ShieldCheck size={14} />
                                Authenticity Guaranteed
                            </p>
                            <p className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-gunmetal/60">
                                <ShieldCheck size={14} />
                                Secure Payment
                            </p>
                        </div>

                    </motion.div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-24">
                <Link to="/collections" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black transition-colors group">
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    Back to Collection
                </Link>
            </div>
        </div>
    );
};

export default WatchDetailsPage;
