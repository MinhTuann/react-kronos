import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

interface GoToTopProps {
    threshold?: number;
}

const GoToTop: React.FC<GoToTopProps> = ({ threshold = 500 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > threshold);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 md:bottom-8 right-6 md:right-8 z-50 p-3 md:p-4 bg-gunmetal/90 text-white rounded-full backdrop-blur-md shadow-2xl hover:bg-black hover:-translate-y-1 transition-all duration-300"
                    title="Go to top"
                >
                    <ArrowUp size={20} strokeWidth={1.5} className="transition-transform duration-300" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default GoToTop;
