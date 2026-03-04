import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import IconButton from './IconButton'
import { WatchIcon, SearchIcon, XIcon } from 'lucide-react'
import { useMotionValueEvent, MotionValue } from 'motion/react'

interface Props {
    scrollY: MotionValue<number>;
}

function Header({ scrollY }: Props) {
    const viewRef = useRef<HTMLDivElement>(null)
    const [isScrolledOutOfVideo, setIsScrolledOutOfVideo] = useState(false)
    // 1. State to manage the menu open/close status
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    
    // Dynamic color logic: If the menu is open OR we scrolled out of the video, use dark mode.
    const useDarkTheme = isMenuOpen || isSearchOpen || isScrolledOutOfVideo
    const iconColorClass = useDarkTheme ? 'text-black' : 'text-white'
    const logoSrc = `${import.meta.env.BASE_URL}logo_${useDarkTheme ? 'black' : 'white'}.png`

    // Handlers to ensure only one overlay is open at a time
    const toggleMenu = () => {
        setIsSearchOpen(false);
        setIsMenuOpen(!isMenuOpen);
    }

    const toggleSearch = () => {
        setIsMenuOpen(false);
        setIsSearchOpen(!isSearchOpen);
    }

    useMotionValueEvent(scrollY, 'change', (current) => {
        setIsScrolledOutOfVideo(current > window.innerHeight - (viewRef.current?.offsetHeight || 0))
    })

    return (
        <>
            {/* --- 1. The Fixed Header (Now z-[80] to float above drawer) --- */}
            <header
                ref={viewRef}
                className={`fixed top-0 z-[80] w-[100dvw] transition-colors duration-500 items-center ${isScrolledOutOfVideo && !isMenuOpen && !isSearchOpen ? 'bg-white' : 'bg-transparent'}`}
            >
                <div className='mx-auto px-6 py-4 grid grid-cols-3 items-center justify-between'>
                    <div className='flex justify-start'>
                        {/* The Morphing Button */}
                        <button 
                            onClick={toggleMenu}
                            className={`p-2 transition-colors duration-300 ${iconColorClass} hover:opacity-70`}
                        >
                            <AnimatedMenuIcon isOpen={isMenuOpen} />
                        </button>
                    </div>
                    
                    <div className='flex justify-center transition-opacity duration-300'>
                        <Link to="/" onClick={() => { setIsMenuOpen(false); setIsSearchOpen(false); }} className='flex items-center'>
                            <img src={logoSrc} alt="logo" className='h-16 md:h-18 transition-all duration-300' />
                        </Link>
                    </div>
                    
                    <div className='flex justify-end'>
                        <div className='flex gap-2 md:gap-6 items-center'>
                            <IconButton icon={<WatchIcon strokeWidth={1.5} />} label={'Products'} className={iconColorClass} />
                            
                            {/* Search Toggle Button */}
                            <button 
                                onClick={toggleSearch}
                                className={`p-2 transition-transform duration-500 ${iconColorClass} hover:opacity-70 flex items-center justify-center w-10 h-10`}
                            >
                                {/* Smoothly swap between Search and X icons */}
                                <AnimatePresence mode="wait">
                                    {isSearchOpen ? (
                                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                                            <XIcon strokeWidth={1.5} size={24} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="search" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.3 }}>
                                            <SearchIcon strokeWidth={1.5} size={24} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- 2. The Animated Sidebar Overlay (z-[60] & z-[70]) --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Glass Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60]"
                        />

                        {/* The Sliding Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed top-0 left-0 h-[100dvh] w-full md:w-[450px] bg-white z-[70] shadow-2xl overflow-hidden flex flex-col pt-32"
                        >
                            {/* Drawer Links */}
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
                                    hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                                }}
                                className="flex flex-col gap-8 px-12"
                            >
                                <span className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 mb-4 border-b border-gunmetal/20 pb-4">
                                    Kronos Luxury Timepieces
                                </span>

                                {['Collections', 'New Arrivals', 'The Company', 'Services'].map((item) => (
                                    <motion.div 
                                        key={item}
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                                        }}
                                    >
                                        <Link 
                                            to="#" 
                                            onClick={() => setIsMenuOpen(false)} 
                                            className="text-3xl md:text-4xl italic text-gunmetal hover:text-black transition-colors"
                                        >
                                            {item}
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Drawer Footer */}
                            <div className="mt-auto p-12 bg-bone/10 border-t border-gray-100">
                                <p className="text-[10px] uppercase tracking-widest text-bone mb-4">Contact Us</p>
                                <a href="mailto:kronos.timepieces08@gmail.com" className="text-sm text-gunmetal border-b border-gunmetal pb-1 hover:text-black hover:border-black transition-colors">
                                    kronos.timepieces08@gmail.com
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- 3. The Full-Screen Search Overlay --- */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ y: '-100%', opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '-100%', opacity: 0.5 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 w-[100dvw] h-[100dvh] bg-white z-[70] flex flex-col pt-40 px-6 md:px-24 shadow-2xl overflow-hidden"
                    >
                        <div className="max-w-4xl mx-auto w-full w-full mt-12 md:mt-24">
                            
                            {/* Search Input Animation */}
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                className="relative group"
                            >
                                <span className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 block mb-6">
                                    Discover
                                </span>
                                
                                <input 
                                    type="text" 
                                    placeholder="Search collections, models, or materials..." 
                                    autoFocus
                                    className="w-full bg-transparent text-2xl md:text-5xl italic text-gunmetal outline-none placeholder:text-gunmetal/20 pb-4 md:pb-6 border-b border-gunmetal/20 transition-colors"
                                />
                                {/* The animated luxury underline */}
                                <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-gunmetal transition-all duration-[800ms] ease-out group-focus-within:w-full" />
                            </motion.div>

                            {/* Suggested Searches - Staggered Reveal */}
                            <motion.div 
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
                                }}
                                className="mt-16"
                            >
                                <span className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/50 block mb-6">
                                    Trending Now
                                </span>
                                <ul className="flex flex-col gap-4">
                                    {['Grand Complications', 'Rose Gold Calatrava', 'Nautilus 5711', 'Perpetual Calendar'].map((suggestion) => (
                                        <motion.li 
                                            key={suggestion}
                                            variants={{
                                                hidden: { opacity: 0, x: -10 },
                                                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                                            }}
                                        >
                                            <button className="text-lg text-gunmetal hover:text-black transition-colors flex items-center gap-4 group">
                                                <span className="h-[1px] w-4 bg-gunmetal/20 group-hover:w-8 group-hover:bg-gunmetal transition-all duration-300"></span>
                                                {suggestion}
                                            </button>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Header;

const AnimatedMenuIcon = ({ isOpen }: { isOpen: boolean }) => (
    <motion.svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        /* Using square linecaps feels more architectural and modern than rounded */
        strokeLinecap="square" 
        strokeWidth="1.5"
    >
        {/* Top Line */}
        <motion.path
            variants={{
                closed: { d: "M 4 9 L 20 9" },
                open: { d: "M 6 6 L 18 18" }
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Bottom Line */}
        <motion.path
            variants={{
                closed: { d: "M 4 15 L 20 15" },
                open: { d: "M 6 18 L 18 6" }
            }}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
    </motion.svg>
);
