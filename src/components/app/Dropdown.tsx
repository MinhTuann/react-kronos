import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownProps {
    value: 'recommended' | 'price-asc' | 'price-desc';
    onChange: (value: 'recommended' | 'price-asc' | 'price-desc') => void;
}

const Dropdown: React.FC<DropdownProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { value: 'recommended', label: 'Recommended' },
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
    ] as const;

    const currentLabel = options.find(opt => opt.value === value)?.label;

    return (
        <div className='relative z-50'>
            {/* The Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-3 group'
            >
                <span className='text-[10px] uppercase tracking-[0.3em] font-semibold text-gunmetal/50 transition-colors group-hover:text-gunmetal/80 hidden sm:block'>
                    Sort By
                </span>
                <span className='text-sm md:text-base italic text-gunmetal group-hover:text-black transition-colors'>
                    {currentLabel}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className='text-gunmetal/50 group-hover:text-black'
                >
                    <ChevronDown size={14} strokeWidth={1.5} />
                </motion.div>
            </button>

            {/* Invisible Full-Screen Overlay to handle clicking outside */}
            {isOpen && (
                <div
                    className='fixed inset-0 z-40'
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* The Animated Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className='absolute right-0 top-full mt-6 w-56 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-gunmetal/5 py-4 z-50'
                    >
                        <div className='flex flex-col'>
                            {options.map((option) => {
                                const isActive = value === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`flex items-center justify-between px-6 py-3 text-left transition-colors duration-300 group
                                            ${isActive ? 'bg-stone-50/50' : 'hover:bg-stone-50'}
                                        `}
                                    >
                                        <span className={`text-xs uppercase tracking-[0.15em] ${isActive ? 'text-black font-semibold' : 'text-gunmetal/70 font-medium group-hover:text-black'}`}>
                                            {option.label}
                                        </span>
                                        
                                        {/* Subtle checkmark for active state */}
                                        {isActive && (
                                            <motion.div 
                                                initial={{ scale: 0, opacity: 0 }} 
                                                animate={{ scale: 1, opacity: 1 }}
                                                className='text-black'
                                            >
                                                <Check size={14} strokeWidth={2} />
                                            </motion.div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
