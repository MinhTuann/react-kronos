import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp, X, ArrowUp } from 'lucide-react';
import type { Watch } from '@/types';
import { WatchItem } from '@/components/home/InStocks';

// --- Mock Data ---
const MOCK_WATCHES: Watch[] = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    brand: 'KRONOS',
    collection: i % 3 === 0 ? 'Grand Complications' : i % 2 === 0 ? 'Nautilus' : 'Calatrava',
    name: `Reference ${5000 + i}`,
    ref: `5000-${i}`,
    color: i % 2 === 0 ? 'Rose Gold' : 'Platinum',
    image: 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif', // Placeholder
    price: 35000 + (i * 1500),
    description: 'A jewelry version of a Patek Philippe classic, this platinum perpetual calendar chronograph is lit up by a setting of baguette-cut rubies on the bezel, lugs and folding clasp. The intense color of the stones is echoed by the lacquered red dial with black-gradient rim as well as by the shiny black alligator strap with contrasting red stitching.',
}));

// --- Main Listing Page ---
const WatchesListing: React.FC = () => {
    // States
    const [watches, setWatches] = useState<Watch[]>(MOCK_WATCHES);
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortMethod, setSortMethod] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
    const [showGoTop, setShowGoTop] = useState(false);

    const itemsPerPage = 9;

    // Derived State for Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentWatches = watches.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(watches.length / itemsPerPage);

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

    // Sorting Logic
    useEffect(() => {
        let sorted = [...MOCK_WATCHES];
        if (sortMethod === 'price-asc') sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        if (sortMethod === 'price-desc') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        setWatches(sorted);
        setCurrentPage(1); // Reset to page 1 on sort
    }, [sortMethod]);

    return (
        <div className='pt-32 pb-24 min-h-screen bg-white relative'>
            
            {/* --- Page Header --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 mb-16 text-center lg:text-left flex flex-col lg:flex-row justify-between items-end gap-8'>
                <div>
                    <span className='font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 block mb-4'>
                        Masterpieces
                    </span>
                    <h1 className='text-4xl md:text-5xl font-serif italic text-gunmetal tracking-tight'>
                        The Collection
                    </h1>
                </div>
                <p className='text-sm font-light text-gunmetal/60 max-w-md leading-relaxed hidden lg:block'>
                    Explore our exquisite range of timepieces, each representing the pinnacle of horological craftsmanship and timeless design.
                </p>
            </div>

            {/* --- Toolbar (Filters Toggle & Sort) --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 border-b border-gunmetal/10 pb-6 flex justify-between items-center sticky top-24 z-30 bg-white backdrop-blur-md py-4'>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className='flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium hover:text-black transition-colors'
                >
                    <Filter size={16} strokeWidth={1.5} />
                    {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                </button>

                <div className='relative group'>
                    <select 
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value as any)}
                        className='appearance-none bg-transparent text-xs uppercase tracking-[0.2em] font-medium pr-8 cursor-pointer outline-none hover:text-black transition-colors'
                    >
                        <option value='recommended'>Recommended</option>
                        <option value='price-asc'>Price: Low to High</option>
                        <option value='price-desc'>Price: High to Low</option>
                    </select>
                    <ChevronDown size={14} strokeWidth={1.5} className='absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none' />
                </div>
            </div>

            {/* --- Main Content Layout --- */}
            <div className='max-w-[1600px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12'>
                
                {/* --- Sidebar Filters --- */}
                <AnimatePresence>
                    {isFilterOpen && (
                        <motion.aside 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 280, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className='hidden lg:block shrink-0 overflow-hidden'
                        >
                            <div className='w-[280px] pr-8 space-y-12'>
                                {/* Filter Group 1 */}
                                <div>
                                    <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>Collections</h4>
                                    <ul className='space-y-3 text-sm font-light text-gunmetal/80'>
                                        <li><label className='flex items-center gap-3 cursor-pointer hover:text-black'><input type='checkbox' className='accent-gunmetal' /> Calatrava</label></li>
                                        <li><label className='flex items-center gap-3 cursor-pointer hover:text-black'><input type='checkbox' className='accent-gunmetal' /> Nautilus</label></li>
                                        <li><label className='flex items-center gap-3 cursor-pointer hover:text-black'><input type='checkbox' className='accent-gunmetal' /> Grand Complications</label></li>
                                    </ul>
                                </div>
                                {/* Filter Group 2 */}
                                <div>
                                    <h4 className='text-[10px] tracking-[0.3em] uppercase font-bold border-b border-gunmetal/10 pb-4 mb-4'>Material</h4>
                                    <ul className='space-y-3 text-sm font-light text-gunmetal/80'>
                                        <li><label className='flex items-center gap-3 cursor-pointer hover:text-black'><input type='checkbox' className='accent-gunmetal' /> Rose Gold</label></li>
                                        <li><label className='flex items-center gap-3 cursor-pointer hover:text-black'><input type='checkbox' className='accent-gunmetal' /> Platinum</label></li>
                                        <li><label className='flex items-center gap-3 cursor-pointer hover:text-black'><input type='checkbox' className='accent-gunmetal' /> Stainless Steel</label></li>
                                    </ul>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* --- Product Grid --- */}
                <div className='flex-1'>
                    {/* Staggered Grid Animation */}
                    <motion.div 
                        key={currentPage + sortMethod} // Re-triggers animation on page or sort change
                        initial='hidden'
                        animate='visible'
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 xl:gap-x-8'
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

                    {/* --- Pagination --- */}
                    <div className='mt-24 border-t border-gunmetal/10 pt-10 flex justify-center items-center gap-8'>
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage(prev => prev - 1); scrollToTop(); }}
                            className='text-[10px] uppercase tracking-[0.2em] font-semibold text-gunmetal/60 hover:text-black disabled:opacity-30 transition-colors'
                        >
                            Previous
                        </button>
                        
                        <div className='flex gap-4 font-serif italic text-lg'>
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
                    </div>
                </div>
            </div>

            {/* --- Go to Top Button --- */}
            <AnimatePresence>
                {showGoTop && (
                    <motion.button
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        onClick={scrollToTop}
                        className='fixed bottom-8 right-8 z-50 p-4 bg-gunmetal/90 text-white rounded-full backdrop-blur-md shadow-2xl hover:bg-black hover:-translate-y-1 transition-all duration-300'
                    >
                        <ArrowUp size={20} strokeWidth={1.5} />
                    </motion.button>
                )}
            </AnimatePresence>
            
        </div>
    );
};

export default WatchesListing;