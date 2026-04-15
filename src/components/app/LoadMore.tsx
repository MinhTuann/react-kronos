import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface LoadMoreProps {
    hasNextPage: boolean;
    isLoadingMore: boolean;
    onLoadMore: () => void;
    className?: string;
    loadingText?: string;
    buttonText?: string;
}

const LoadMore: React.FC<LoadMoreProps> = ({
    hasNextPage,
    isLoadingMore,
    onLoadMore,
    className = '',
    buttonText
}) => {
    const { t } = useTranslation();

    if (!hasNextPage) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className={`my-12 w-full flex flex-col items-center justify-center ${className}`}
        >
            <div className="relative group cursor-pointer flex flex-col items-center gap-4" onClick={onLoadMore}>
                
                {/* The "Micro-Action" Button */}
                <button
                    disabled={isLoadingMore}
                    className="flex flex-col items-center gap-3 focus:outline-none"
                >
                    <span className={`font-branding text-[8px] tracking-[0.5em] text-gunmetal/30 transition-all duration-700 uppercase group-hover:text-gunmetal group-hover:tracking-[0.7em] ${isLoadingMore ? 'opacity-0' : 'opacity-100'}`}>
                        {buttonText || t('common.load_more', 'Load More')}
                    </span>
                    
                    {/* The Kinetic Line */}
                    <div className="relative w-10 h-px bg-gunmetal/10 overflow-hidden group-hover:bg-golden/20 group-hover:w-16 transition-all duration-700">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={isLoadingMore ? { x: ["-100%", "100%"] } : { x: "-100%" }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="absolute inset-y-0 w-1/2 bg-golden"
                        />
                    </div>

                    {isLoadingMore && (
                        <span className="font-branding text-[7px] tracking-[0.4em] text-golden uppercase animate-pulse">
                            {t('common.syncing', 'SYNCING')}
                        </span>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default LoadMore;
