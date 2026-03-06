import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';

const AboutUsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- Animation Configurations ---
    const customEase: Easing = [0.16, 1, 0.3, 1];

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 1, ease: customEase } }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    // Parallax hook for the main hero text
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

    return (
        <div className="bg-white text-gunmetal overflow-hidden selection:bg-gunmetal selection:text-white">

            {/* --- 1. The Hero Section (Cinematic & Typographic) --- */}
            <section ref={heroRef} className="relative h-screen min-h-[800px] flex items-center justify-center pt-20">
                {/* Architectural Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
                    <span className="font-branding text-[16vw] leading-none tracking-tighter text-stone-50 font-bold">
                        2022
                    </span>
                </div>

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6"
                >
                    <motion.span variants={fadeUp} className="font-branding text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gunmetal/60 mb-8 block">
                        Ho Chi Minh City
                    </motion.span>
                    <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl italic font-serif tracking-tight mb-10 leading-[1.1] text-gunmetal">
                        Immortal Value <br className="hidden md:block" /> Across Generations.
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-base md:text-lg font-light text-stone-500 leading-relaxed max-w-xl">
                        To possess a luxury timepiece is not merely to keep time, but to hold a legacy. We are dedicated to bringing the world's most precious, rare, and exclusive horological masterpieces to Vietnam.
                    </motion.p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <span className="font-branding text-[9px] tracking-[0.3em] uppercase text-gunmetal/40">Discover</span>
                    <div className="w-[1px] h-12 bg-gunmetal/20 overflow-hidden">
                        <motion.div
                            animate={{ y: [0, 48, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-1/2 bg-gunmetal"
                        />
                    </div>
                </motion.div>
            </section>

            {/* --- 2. The Name Story (Sticky Editorial Layout) --- */}
            <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 md:py-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative items-start">

                    {/* --- Sticky Left Column (Text) --- */}
                    <div className="lg:col-span-5 relative h-full">
                        <div className="lg:sticky lg:top-1/3 flex flex-col pb-12">
                            <motion.span
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                                className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/40 font-bold mb-8 flex items-center gap-4"
                            >
                                Chapter I
                                <span className="h-[1px] w-8 bg-gunmetal/20"></span>
                            </motion.span>

                            <motion.h2
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                                className="text-3xl md:text-5xl font-light text-gunmetal mb-8 leading-tight"
                            >
                                The Story of <span className="italic font-serif">Kronos Luxury Timepieces.</span>
                            </motion.h2>

                            <motion.div
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                                className="space-y-6 text-[14px] md:text-[15px] font-light text-stone-500 leading-relaxed"
                            >
                                <motion.p variants={fadeUp}>
                                    In ancient mythology, Kronos is the personification of time itself—an unstoppable force that shapes the universe. We adopted this name because true luxury timepieces transcend their mechanical purpose; they become immortal values that endure through generations.
                                </motion.p>
                                <motion.p variants={fadeUp}>
                                    Kronos Luxury Timepieces was established to be the premier destination for high-end, genuine watches in Ho Chi Minh City. We bridge the gap between Vietnamese collectors and the world's most illustrious brands, including Rolex, Patek Philippe, Hublot, and Richard Mille.
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>

                    {/* --- Scrolling Right Column (Structured Staggered Grid) --- */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-8 relative">

                        {/* Left Image Column */}
                        <div className="flex flex-col gap-4 md:gap-8">
                            {/* 1. Tall Display Case */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: customEase }}
                                className="aspect-[3/4] w-full bg-stone-100 overflow-hidden group"
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}DSC04307.jpg`}
                                    alt="Luxury Watch Display"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out rounded-lg"
                                />
                            </motion.div>

                            {/* 2. Square Lifestyle Shot */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.2, ease: customEase }}
                                className="aspect-square w-full bg-stone-100 overflow-hidden group"
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}edited.jpg`}
                                    alt="Timeless Elegance on Wrist"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out rounded-lg"
                                />
                            </motion.div>
                        </div>

                        {/* Right Image Column (Pushed down via padding to create the stagger effect) */}
                        <div className="flex flex-col gap-4 md:gap-8 pt-12 md:pt-24">
                            {/* 3. Square Lounge Shot */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.1, ease: customEase }}
                                className="aspect-square w-full bg-stone-100 overflow-hidden group"
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}IMG_3297.jpg`}
                                    alt="The Kronos Lounge"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out rounded-lg"
                                />
                            </motion.div>

                            {/* 4. Tall Art & Chandelier Shot */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, delay: 0.3, ease: customEase }}
                                className="aspect-[3/4] md:aspect-[4/5] w-full bg-stone-100 overflow-hidden group"
                            >
                                <img
                                    src={`${import.meta.env.BASE_URL}IMG_1875.jpg`}
                                    alt="Boutique Elegance"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2.5s] ease-out rounded-lg"
                                />
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* --- 3. The Boutique Decor (Dark Mode Contrast Section) --- */}
            <section className="bg-gunmetal text-white py-32 md:py-48 px-6 lg:px-12 relative overflow-hidden">
                {/* Giant Background Watermark for Depth */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-[10%] select-none pointer-events-none opacity-[0.03] z-0">
                    <span className="font-serif italic text-[35vw] leading-none whitespace-nowrap">
                        Atelier
                    </span>
                </div>

                <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center relative z-10">

                    {/* --- Left: Text & Architectural Specs (5 Columns) --- */}
                    <div className="lg:col-span-5 flex flex-col">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                            className="max-w-lg"
                        >
                            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 leading-tight">
                                The Boutique Space.
                            </motion.h2>
                            <motion.p variants={fadeUp} className="text-stone-400 font-light leading-relaxed mb-6 text-[15px]">
                                Step into a space designed to meet modern, world-class standards right in the heart of Vietnam. The interior decor of Kronos Luxury Timepieces reflects the very watches we carry: precise, elegant, and uncompromising.
                            </motion.p>
                            <motion.p variants={fadeUp} className="text-stone-400 font-light leading-relaxed mb-12 text-[15px]">
                                We have cultivated a private, highly personalized shopping environment. From the ambient lighting that catches the gleam of a sapphire crystal, to the tailored consultation areas, the boutique ensures an exclusive care experience.
                            </motion.p>

                            {/* Architectural Spec Sheet */}
                            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10 mb-12">
                                <div>
                                    <span className="block font-branding text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Atmosphere</span>
                                    <span className="block text-sm font-light text-white">Private & Personalized</span>
                                </div>
                                <div>
                                    <span className="block font-branding text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">Location</span>
                                    <span className="block text-sm font-light text-white">Ho Chi Minh City</span>
                                </div>
                            </motion.div>

                            <motion.button variants={fadeUp} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] font-branding hover:text-white transition-colors">
                                <span className="h-[1px] w-8 bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                Visit the Store
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* --- Right: The 3-Image Macro/Wide Cluster (7 Columns) --- */}
                    <div className="lg:col-span-7 relative w-full mt-12 lg:mt-0">

                        {/* Mobile Fallback Image (Hidden on Desktop) */}
                        <div className="block lg:hidden w-full aspect-[4/3] overflow-hidden rounded-sm">
                            <img src={`${import.meta.env.BASE_URL}DSC04308.jpg`} className="w-full h-full object-cover rounded-lg" alt="Kronos Lounge" />
                        </div>

                        {/* Desktop Immersive Cluster (Hidden on Mobile) */}
                        <div className="hidden lg:block relative h-[700px] w-full">

                            {/* Image 1: The Wide Shot (Lounge) - Anchors the background */}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: customEase }}
                                className="absolute top-0 right-0 w-[65%] aspect-[4/5] overflow-hidden rounded-lg bg-gunmetal"
                            >
                                <img src={`${import.meta.env.BASE_URL}DSC04308.jpg`} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700" alt="Kronos Lounge" />
                            </motion.div>

                            {/* Image 2: The Medium Shot (Consultation Desk) - Overlaps bottom left */}
                            <motion.div
                                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2, ease: customEase }}
                                className="absolute bottom-10 left-[10%] w-[45%] aspect-[3/4] overflow-hidden rounded-lg border-[8px] border-gunmetal shadow-2xl z-20"
                            >
                                <img src={`${import.meta.env.BASE_URL}DSC04306.jpg`} className="w-full h-full object-cover" alt="Consultation Area" />
                            </motion.div>

                            {/* Image 3: The Macro Detail (Candle/Frame) - Overlaps top left */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.4, ease: customEase }}
                                className="absolute top-16 left-0 w-[30%] aspect-square overflow-hidden rounded-lg border-[6px] border-gunmetal shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-30"
                            >
                                <img src={`${import.meta.env.BASE_URL}kronos.jpg`} className="w-full h-full object-cover rounded-lg" alt="Boutique Details" />
                            </motion.div>

                        </div>
                    </div>

                </div>
            </section>

            {/* --- 4. The Pillars (Editorial List Layout) --- */}
            <section className="py-24 md:py-40 max-w-[1200px] mx-auto px-6 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 flex flex-col items-center text-center"
                >
                    <span className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/40 font-bold mb-6 flex items-center gap-4">
                        The Pillars
                    </span>
                    <h2 className="text-3xl md:text-4xl italic font-serif text-gunmetal">Our Core Values</h2>
                </motion.div>

                <div className="flex flex-col">
                    {[
                        { title: 'Genuine Authenticity', desc: 'Committed to delivering 100% genuine luxury timepieces, complete with original boxes, paperwork, and manufacturer warranties.' },
                        { title: 'Enduring Legacy', desc: 'Offering timepieces that are precious, durable, and capable of holding their value across time, space, and generations.' },
                        { title: 'Exclusive Experience', desc: 'Providing highly trained ambassadors who deliver world-class, personalized care and long-term after-sales service.' }
                    ].map((value, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-gunmetal/10 hover:border-gunmetal transition-colors duration-500"
                        >
                            <div className="flex items-center gap-8 md:gap-16 mb-4 md:mb-0">
                                <span className="font-serif italic text-4xl text-gunmetal/20 group-hover:text-gunmetal transition-colors duration-500">
                                    {`0${idx + 1}`}
                                </span>
                                <h3 className="text-xl md:text-2xl font-light text-gunmetal tracking-wide">
                                    {value.title}
                                </h3>
                            </div>
                            <p className="text-[13px] md:text-[14px] font-light text-stone-500 md:max-w-[40%] leading-relaxed">
                                {value.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- 5. The Epilogue (Conclusion) --- */}
            {/* Removed the max-w wrapper to allow an edge-to-edge split screen */}
            <section className="flex flex-col lg:flex-row min-h-[80vh] border-t border-gunmetal/10 bg-white">

                {/* Left: The Moody Lifestyle Image (Full Bleed) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    className="w-full lg:w-1/2 relative min-h-[50vh] lg:min-h-full overflow-hidden"
                >
                    <img
                        src={`${import.meta.env.BASE_URL}DSC07574.jpg`}
                        alt="Enduring Value"
                        className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-[4s] ease-out"
                    />
                </motion.div>

                {/* Right: The Final Quote (High Negative Space) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-12 lg:p-24 xl:p-32 bg-stone-50">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: customEase }}
                        className="max-w-xl"
                    >
                        <span className="font-branding text-[10px] tracking-[0.5em] uppercase text-gunmetal/40 font-bold mb-10 flex items-center gap-4">
                            <span className="h-[1px] w-8 bg-gunmetal/20"></span>
                            The Epilogue
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl italic font-serif text-gunmetal leading-[1.15] mb-16">
                            "More than a transaction—a commitment to prestige and immortal value."
                        </h2>

                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-branding tracking-[0.3em] uppercase text-gunmetal">
                                The Founders
                            </span>
                            <span className="text-[13px] font-light text-stone-500">
                                Ho Chi Minh City, Vietnam
                            </span>
                        </div>
                    </motion.div>
                </div>

            </section>

        </div>
    );
};

export default AboutUsPage;