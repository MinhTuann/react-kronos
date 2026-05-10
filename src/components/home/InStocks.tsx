import { useRef, useState } from 'react'
import type { Watch, Accessory } from '@/types'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import type { Easing, Variants } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getWatchUrl, getAccessoryUrl } from '@/utils'
import { WatchCardSkeleton, Skeleton } from '../common/Skeleton'

export const WatchItem = ({ watch }: { watch: Watch }) => {
    // 1. Create a reference to the watch card
    const ref = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // 2. The magic: This triggers 'true' ONLY when the item enters the middle 40% of the screen!
    const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

    return (
        <Link
            ref={ref}
            to={getWatchUrl(watch)}
            className='block group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
        >
            {/* Image Container */}
            <div className='relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center p-12'>
                {!imageLoaded && (
                    <div className="absolute inset-0 p-12">
                        <Skeleton className="w-full h-full rounded-2xl" />
                    </div>
                )}
                <img
                    src={watch.image}
                    alt={watch.name}
                    onLoad={() => setImageLoaded(true)}
                    /* On mobile: scales up if in center. On desktop: scales up only on hover. */
                    className={`w-[85%] h-auto object-contain transition-all duration-[1.5s] ease-[cubic-bezier(0.2,1,0.3,1)] 
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                        ${isInView ? 'scale-105' : 'scale-100'} 
                        md:scale-100 md:group-hover:scale-105`}
                />
            </div>

            {/* Content Area */}
            <div className='flex flex-col items-center text-center pb-10 px-8 space-y-1'>
                <span className='font-branding text-[8px] tracking-[0.3em] uppercase text-golden font-bold opacity-80 mb-2'>
                    {watch.brand}
                </span>

                <h3 className='text-lg tracking-tight text-gunmetal italic'>
                    <span aria-hidden='true' className='absolute inset-0'></span>
                    {watch.collection}
                </h3>

                <div className='flex flex-col items-center'>
                    <p className='text-[11px] uppercase tracking-widest text-bone'>
                        {watch.name}
                    </p>
                    {/* Decorative divider */}
                    {/* On mobile: expands if in center. On desktop: expands only on hover. */}
                    <div className={`h-[1px] bg-golden mt-3 transition-all duration-500 
                        ${isInView ? 'w-12' : 'w-4'} 
                        md:w-4 md:group-hover:w-12`}
                    />
                </div>

                {/* Price or Detail Container */}
                {/* On mobile: slides down if in center. On desktop: slides down only on hover. */}
                <div className={`overflow-hidden transition-all duration-500 
                    ${isInView ? 'h-6 opacity-100' : 'h-0 opacity-0'} 
                    md:h-0 md:opacity-0 md:group-hover:h-6 md:group-hover:opacity-100`}
                >
                    <p className='text-[12px] text-gunmetal font-branding mt-2'>
                        REF. {watch.ref}
                    </p>
                </div>
            </div>
        </Link >
    )
}

export const AccessoryItem = ({ accessory }: { accessory: Accessory }) => {
    // 1. Create a reference to the card
    const ref = useRef(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    // 2. The magic: This triggers 'true' ONLY when the item enters the middle 40% of the screen!
    const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

    return (
        <Link
            ref={ref}
            to={getAccessoryUrl(accessory)}
            className='block group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]'
        >
            {/* Image Container */}
            <div className='relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center p-12'>
                {!imageLoaded && (
                    <div className="absolute inset-0 p-12">
                        <Skeleton className="w-full h-full rounded-2xl" />
                    </div>
                )}
                <img
                    src={accessory.image}
                    alt={accessory.name}
                    onLoad={() => setImageLoaded(true)}
                    /* On mobile: scales up if in center. On desktop: scales up only on hover. */
                    className={`w-[85%] h-auto object-contain transition-all duration-[1.5s] ease-[cubic-bezier(0.2,1,0.3,1)] 
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                        ${isInView ? 'scale-105' : 'scale-100'} 
                        md:scale-100 md:group-hover:scale-105`}
                />
            </div>

            {/* Content Area */}
            <div className='flex flex-col items-center text-center pb-10 px-8 space-y-1'>
                <span className='font-branding text-[8px] tracking-[0.3em] uppercase text-golden font-bold opacity-80 mb-2'>
                    {accessory.brand}
                </span>

                <h3 className='text-lg tracking-tight text-gunmetal italic'>
                    <span aria-hidden='true' className='absolute inset-0'></span>
                    {accessory.collection || 'Accessory'}
                </h3>

                <div className='flex flex-col items-center'>
                    <p className='text-[11px] uppercase tracking-widest text-bone'>
                        {accessory.name}
                    </p>
                    {/* Decorative divider */}
                    {/* On mobile: expands if in center. On desktop: expands only on hover. */}
                    <div className={`h-[1px] bg-golden mt-3 transition-all duration-500 
                        ${isInView ? 'w-12' : 'w-4'} 
                        md:w-4 md:group-hover:w-12`}
                    />
                </div>

                {/* Price or Detail Container */}
                {/* On mobile: slides down if in center. On desktop: slides down only on hover. */}
                <div className={`overflow-hidden transition-all duration-500 
                    ${isInView ? 'h-6 opacity-100' : 'h-0 opacity-0'} 
                    md:h-0 md:opacity-0 md:group-hover:h-6 md:group-hover:opacity-100`}
                >
                    <p className='text-[12px] text-gunmetal font-branding mt-2'>
                        REF. {accessory.ref}
                    </p>
                </div>
            </div>
        </Link >
    )
}

const InStocks = ({ watches = [], isLoading = false }: { watches?: Watch[], isLoading?: boolean }) => {
    const { t } = useTranslation();
    // --- Animation Configurations ---
    const customEase: Easing = [0.16, 1, 0.3, 1];

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: customEase } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            // Staggers each watch item so they pop in sequentially on mobile
            transition: { staggerChildren: 0.15 }
        }
    };

    return (
        <div className='bg-white overflow-hidden'>
            <div className='max-w-2xl lg:max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8'>

                {/* --- Animated Header --- */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: customEase }}
                    className='border-l border-golden pl-4 space-y-2 mb-6 md:mb-10'
                >
                    <h2 className='font-branding text-lg tracking-widest uppercase text-golden'>{t('home.inStockTitle')}</h2>
                    <p className='italic tracking-tight text-bone'>{t('home.inStockSubtitle')}</p>
                </motion.div>

                {/* --- Animated Watch Grid --- */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    /* The negative margin ensures animation triggers slightly before scrolling fully into view */
                    viewport={{ once: true, margin: "-50px" }}
                    className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'
                >
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <motion.div key={i} variants={fadeUp}>
                                <WatchCardSkeleton />
                            </motion.div>
                        ))
                    ) : (
                        watches.map((watch) => (
                            <motion.div key={watch.id} variants={fadeUp}>
                                <WatchItem watch={watch} />
                            </motion.div>
                        ))
                    )}
                </motion.div>

                {/* --- Animated Footer Button --- */}
                {!isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.8, delay: 0.2, ease: customEase }}
                        className='flex justify-center mt-12 md:mt-16'
                    >
                        <Link to='/collections' className='group relative inline-flex justify-center items-center pb-2 text-xs tracking-[0.4em] uppercase text-bone font-semibold transition-colors duration-500 hover:text-bone'>
                            {/* The Button Text */}
                            <span>{t('home.findYourWatch')}</span>

                            {/* The Animated Underline */}
                            <span className='absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-bone transition-all duration-[600ms] ease-out group-hover:w-full group-hover:bg-bone' />
                        </Link>
                    </motion.div>
                )}

            </div>
        </div>
    )
}

export default InStocks;