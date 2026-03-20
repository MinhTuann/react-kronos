import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import type { Watch } from '@/types';

import { publicApi } from '@/lib/api';

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo(0, 0);

        // Fetch watch details from public API
        const fetchDetails = async () => {
            if (!id) return;
            try {
                setIsLoading(true);
                const data = await publicApi.getWatchById(id);
                setWatch(data);
            } catch (err) {
                console.error("Failed to load details:", err);
                setWatch(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="pt-32 pb-24 min-h-[60vh] flex flex-col items-center justify-center">
                 <div className="w-8 h-8 border-2 border-gunmetal/20 border-t-gunmetal rounded-full animate-spin" />
            </div>
        );
    }

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
                                {watch.size && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Case Size</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.size}</p>
                                    </div>
                                )}
                                {(watch.material || watch.color) && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Material</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.material || watch.color}</p>
                                    </div>
                                )}
                                {watch.movement && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Movement</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.movement}</p>
                                    </div>
                                )}
                                {watch.strap && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Strap</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.strap}</p>
                                    </div>
                                )}
                                {watch.dial && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Dial</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.dial}</p>
                                    </div>
                                )}
                                {watch.condition && (
                                    <div>
                                        <p className="text-[10px] tracking-[0.2em] uppercase text-gunmetal/50 mb-1">Condition</p>
                                        <p className="text-sm font-medium text-gunmetal">{watch.condition}</p>
                                    </div>
                                )}
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
