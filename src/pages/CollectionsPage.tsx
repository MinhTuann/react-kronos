import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ArrowUp, X } from 'lucide-react';
import type { Watch } from '@/types';
import { WatchItem } from '@/components/home/InStocks';
// import { Dropdown } from '@/components/app';

import { publicApi } from '@/lib/api';
import type { PublicBrand, PublicCollection } from '@/lib/api';

const CollectionsPage: React.FC = () => {
    // States
    const [watches, setWatches] = useState<Watch[]>([]);
    // const [originalWatches, setOriginalWatches] = useState<Watch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // const [sortMethod, setSortMethod] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
    const [showGoTop, setShowGoTop] = useState(false);

    // Search Query parsing
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || undefined;

    // Filter States
    const [brands, setBrands] = useState<PublicBrand[]>([]);
    const [collections, setCollections] = useState<PublicCollection[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

    const itemsPerPage = 9;

    // Derived State for Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentWatches = watches.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(watches.length / itemsPerPage);

    // Initial Filters Fetch (Runs Once)
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [bData, cData] = await Promise.all([
                    publicApi.getBrands(),
                    publicApi.getCollections()
                ]);
                setBrands(bData);
                setCollections(cData);
            } catch (err) {
                console.error("Failed to fetch filters:", err);
            }
        };
        fetchFilters();
    }, []);

    // Fetch Watches (Runs on mount and when filters/search changes)
    useEffect(() => {
        const fetchWatches = async () => {
            try {
                setIsLoading(true);
                // Pass the first selected brand ID (if any) and all selected collection IDs
                const brandId = selectedBrands.length > 0 ? selectedBrands[0] : undefined;
                const collectionIds = selectedCollections.length > 0 ? selectedCollections : undefined;
                
                const data = await publicApi.getWatches(brandId, collectionIds, searchQuery);
                // setOriginalWatches(data);
                setWatches(data);
                setCurrentPage(1); 
            } catch (err) {
                console.error("Failed to fetch public watches:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWatches();
    }, [searchQuery, selectedBrands, selectedCollections]);

    // Scroll Listener for "Go to Top" button
    useEffect(() => {
        const handleScroll = () => {
            setShowGoTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sorting Logic (Client-side)
    // useEffect(() => {
    //     let filtered = [...originalWatches];

    //     // Apply sorting
    //     if (sortMethod === 'price-asc') filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    //     if (sortMethod === 'price-desc') filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));

    //     setWatches(filtered);
    //     setCurrentPage(1);
    // }, [sortMethod, originalWatches, selectedBrands, selectedCollections]);

    // --- Filter Content Render Function (Desktop Sidebar & Mobile Drawer) ---
    const renderFilterContent = () => {
        const toggleBrand = (brandId: string | null) => {
            // When brand selection changes, clear all selected collections
            setSelectedCollections([]);
            setSelectedBrands(prevBrands => {
                if (brandId === null) return [];
                if (prevBrands.includes(brandId)) {
                    return []; // Allow toggle off
                }
                return [brandId];
            });
        };

        const toggleCollection = (collectionId: string) => {
            setSelectedCollections(prev =>
                prev.includes(collectionId) ? prev.filter(id => id !== collectionId) : [...prev, collectionId]
            );
        };

        const visibleCollections = collections.filter(c => selectedBrands.includes(c.brand_id));

        return (
            <div className='pr-4 lg:pr-8 space-y-10 lg:space-y-12'>
                {brands.length > 0 && (
                    <div>
                        <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>Brands</h4>
                        <ul className='space-y-4 lg:space-y-3 text-sm font-light max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
                            {brands.map(brand => {
                                const isSelected = selectedBrands.includes(brand.id);
                                return (
                                    <li key={brand.id}>
                                        <label className={`flex items-center gap-3 cursor-pointer group transition-colors ${isSelected ? 'text-black font-medium' : 'text-gunmetal/60 hover:text-black'}`}>
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type='radio'
                                                    name='brand'
                                                    className='sr-only'
                                                    checked={isSelected}
                                                    onClick={() => toggleBrand(brand.id)}
                                                    onChange={() => { }}
                                                />
                                                {/* Outer Circle */}
                                                <div className={`w-4 h-4 rounded-full border transition-all duration-300 ${isSelected ? 'border-gunmetal bg-gunmetal/5' : 'border-gunmetal/20 group-hover:border-gunmetal/40'}`} />
                                                {/* Inner Dot */}
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            className="absolute w-1.5 h-1.5 rounded-full bg-gunmetal"
                                                        />
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            {brand.name}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {selectedBrands.length > 0 && visibleCollections.length > 0 && (
                    <div>
                        <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>Collections</h4>
                        <ul className='space-y-4 lg:space-y-3 text-sm font-light text-gunmetal/80 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
                            {visibleCollections.map(collection => (
                                <li key={collection.id}>
                                    <label className='flex items-center gap-3 cursor-pointer hover:text-black'>
                                        <input
                                            type='checkbox'
                                            className='accent-gunmetal w-4 h-4'
                                            checked={selectedCollections.includes(collection.id)}
                                            onChange={() => toggleCollection(collection.id)}
                                        />
                                        {collection.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Mobile Apply Button */}
                <div className="lg:hidden pt-8 border-t border-gunmetal/10">
                    <button
                        onClick={() => setIsFilterOpen(false)}
                        className="w-full bg-gunmetal text-white text-xs uppercase tracking-widest py-4 rounded hover:bg-black transition-colors"
                    >
                        Apply Filters ({selectedBrands.length + selectedCollections.length})
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='pt-24 md:pt-32 pb-24 min-h-screen bg-white relative'>

            {/* --- Page Header --- */}
            {/* Fix: Changed flex layout to stack cleanly on mobile */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 md:mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between lg:items-end gap-4 md:gap-8'>
                <div className="w-full">
                    {/* The Header now spans full width on mobile so the text centers properly */}
                    <div className="flex flex-col items-center lg:items-start">
                        <span className='font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 block mb-2 md:mb-4'>
                            Masterpieces
                        </span>
                        <h1 className='text-4xl md:text-5xl italic text-gunmetal tracking-tight'>
                            The Collection
                        </h1>
                    </div>
                </div>
                <p className='text-sm font-light text-gunmetal/60 max-w-md leading-relaxed hidden lg:block'>
                    Explore our exquisite range of timepieces, each representing the pinnacle of horological craftsmanship and timeless design.
                </p>
            </div>

            {/* --- Toolbar (Filters Toggle & Sort) --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-10 border-b border-gunmetal/10 pb-4 md:pb-6 flex justify-between items-center sticky top-20 md:top-24 z-30 bg-white/95 backdrop-blur-md py-4'>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className='flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium hover:text-black transition-colors'
                >
                    <Filter size={16} strokeWidth={1.5} />
                    <span className="hidden sm:inline">{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
                    <span className="sm:hidden">Filter</span>
                </button>

                {/* Temporarily hide sort UI */}
                {/* <Dropdown
                    value={sortMethod}
                    onChange={setSortMethod}
                /> */}
            </div>

            {/* --- Main Content Layout --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row'>

                {/* --- Desktop Sidebar Filters --- */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.aside
                            /* 2. Added marginRight animation to perfectly match Tailwind's gap-12 (48px) */
                            initial={{ width: 0, opacity: 0, marginRight: 0 }}
                            animate={{ width: 280, opacity: 1, marginRight: 48 }}
                            exit={{ width: 0, opacity: 0, marginRight: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className='hidden lg:block shrink-0 overflow-hidden'
                        >
                            <div className='w-[280px]'>
                                {renderFilterContent()}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* --- Product Grid --- */}
                {/* 1. Add motion.div and layout here so the container animates its width change smoothly */}
                <div className='flex-1 relative min-h-[400px]'>
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-gunmetal/20 border-t-gunmetal rounded-full animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            key={`${currentPage}-${'sortMethod'}-${selectedBrands.join(',')}-${selectedCollections.join(',')}`}
                            initial='hidden'
                            animate='visible'
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 xl:gap-x-8'
                        >
                            {currentWatches.map((watch) => (
                                <motion.div
                                    key={watch.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 30 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                    }}
                                >
                                    <WatchItem watch={watch} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* --- Pagination --- */}
                    <motion.div layout className='mt-16 md:mt-24 border-t border-gunmetal/10 pt-8 md:pt-10 flex justify-between md:justify-center items-center gap-4 md:gap-8'>
                        {/* ... Pagination buttons stay exactly the same ... */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage(prev => prev - 1); scrollToTop(); }}
                            className='text-[10px] uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black disabled:opacity-30 transition-colors'
                        >
                            Prev<span className="hidden sm:inline">ious</span>
                        </button>

                        <div className='flex gap-3 md:gap-4 font-serif italic text-base md:text-lg'>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setCurrentPage(i + 1); scrollToTop(); }}
                                    className={`transition-colors duration-300 ${currentPage === i + 1 ? 'text-black' : 'text-gunmetal/30 hover:text-gunmetal/70'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => { setCurrentPage(prev => prev + 1); scrollToTop(); }}
                            className='text-[10px] uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black disabled:opacity-30 transition-colors'
                        >
                            Next
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* --- Mobile Filter Slide-over Drawer --- */}
            {/* This only shows on screens smaller than 'lg' when isFilterOpen is true */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="lg:hidden">
                        {/* Dark backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
                        {/* Sliding drawer from the left */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 w-[85vw] sm:w-[320px] h-[100dvh] bg-white z-50 p-6 sm:p-8 overflow-y-auto flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-10 pb-4 border-b border-gunmetal/10">
                                <span className="font-branding text-[12px] tracking-[0.3em] uppercase text-gunmetal">Filters</span>
                                <button onClick={() => setIsFilterOpen(false)} className="p-2 -mr-2 text-gunmetal/60 hover:text-black">
                                    <X size={20} strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Reuse the filter content */}
                            <div className="flex-1">
                                {renderFilterContent()}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- Go to Top Button --- */}
            <AnimatePresence>
                {showGoTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        onClick={scrollToTop}
                        /* Adjusted position slightly for mobile to avoid native browser UI */
                        className='fixed bottom-6 md:bottom-8 right-6 md:right-8 z-50 p-3 md:p-4 bg-gunmetal/90 text-white rounded-full backdrop-blur-md shadow-2xl hover:bg-black hover:-translate-y-1 transition-all duration-300'
                    >
                        <ArrowUp size={20} strokeWidth={1.5} />
                    </motion.button>
                )}
            </AnimatePresence>

        </div>
    );
};

export default CollectionsPage;