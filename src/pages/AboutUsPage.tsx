import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { Variants, Easing } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { YEAR_OF_FOUNDATION } from '@/utils';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';

const aboutContent = {
    en: {
        heroKicker: 'Ho Chi Minh City',
        heroTitle: <>The Philosophy of <br className="hidden md:block" /> Immortal Value.</>,
        heroLead: 'To own a luxury timepiece is not merely to track the passing minutes; it is to hold a legacy in the palm of your hand. At Kronos, we believe a watch is the only heartbeat you can wear on your wrist, a silent witness to your triumphs, passed down from one generation to the next. We don’t just sell watches, we curate "Immortal Values".',
        discover: 'Discover',
        chapterOneLabel: 'Chapter I',
        chapterOneTitle: <>The Genesis of Kronos — <span className="italic font-serif">The Sovereign of Time.</span></>,
        chapterOneParagraphs: [
            'Inspired by Kronos, the King of the Titans, sovereign of the Golden Age, and the personification of eternal Time.',
            'We chose this name out of a core conviction: In an era where all things eventually fade, a horological masterpiece is the only thing that defies the erosion of time. Kronos Luxury Timepieces was established to unite Vietnam’s elite collectors with the world’s most illustrious watch empires: Rolex, Patek Philippe, Audemars Piguet, and Richard Mille.'
        ],
        chapterTwoTitle: 'A Sanctuary for Connoisseurs.',
        chapterTwoParagraphs: [
            'Located in the heart of Ho Chi Minh City, Kronos Luxury Timepieces is far more than a mere retail space; it is a sanctuary of sophistication.',
            'From the ambient glow dancing on sapphire crystals to our private consultation suites, every detail is meticulously curated to international standards. Here, we ensure that every guest immerses themselves in the essence of prestige from the very first moment of their presence.'
        ],
        atmosphereLabel: 'Atmosphere',
        atmosphereValue: 'Sanctuary of Sophistication',
        locationLabel: 'Location',
        locationValue: 'Ho Chi Minh City',
        visitStore: 'Visit the Store',
        pillarsLabel: 'The Pillars',
        pillarsTitle: 'Our Core Values',
        pillars: [
            { title: 'Genuine Authenticity', desc: 'Committed to delivering 100% genuine luxury timepieces, complete with original boxes, paperwork, and manufacturer warranties.' },
            { title: 'Enduring Legacy', desc: 'Offering timepieces that are precious, durable, and capable of holding their value across time, space, and generations.' },
            { title: 'Exclusive Experience', desc: 'Providing highly trained ambassadors who deliver world-class, personalized care and long-term after-sales service.' }
        ],
        epilogueLabel: 'The Epilogue',
        epilogueQuote: '"More than a transaction—a commitment to prestige and immortal value."',
        founders: 'The Founders',
        city: 'Ho Chi Minh City, Vietnam'
    },
    vi: {
        heroKicker: 'TP. Hồ Chí Minh',
        heroTitle: <>Triết lý về <br className="hidden md:block" /> Giá trị Bất biến.</>,
        heroLead: 'Sở hữu một cỗ máy thời gian xa xỉ không chỉ đơn thuần là việc xem giờ, mà là nắm giữ một di sản trong lòng bàn tay. Tại Kronos, chúng tôi tin rằng mỗi chiếc đồng hồ là một "nhịp đập" có thể đeo trên cổ tay, một nhân chứng thầm lặng cho những thành tựu đời người, được truyền thừa qua nhiều thế hệ. Chúng tôi không chỉ mang đến những chiếc đồng hồ; chúng tôi trao gửi những "Giá trị Bất tử".',
        discover: 'Khám phá',
        chapterOneLabel: 'Chương I',
        chapterOneTitle: <>Khởi nguồn của <span className="italic font-serif">Kronos.</span></>,
        chapterOneParagraphs: [
            'Lấy cảm hứng từ Kronos, vị vua của các Titan, người cai trị Thời đại Hoàng kim và là hiện thân của Thời gian vĩnh hằng.',
            'Chúng tôi chọn cái tên này xuất phát từ một niềm tin cốt lõi: Trong thời đại mà mọi thứ cuối cùng đều phai tàn, một kiệt tác chế tác đồng hồ là thứ duy nhất thách thức sự bào mòn của thời gian. Kronos được thành lập để kết nối những nhà sưu tập đồng hồ tinh hoa của Việt Nam với những đế chế đồng hồ danh tiếng nhất thế giới: Rolex, Patek Philippe, Audemars Piguet và Richard Mille.'
        ],
        chapterTwoTitle: 'Thánh đường của những tâm hồn mộ điệu.',
        chapterTwoParagraphs: [
            'Tọa lạc tại trung tâm TP. Hồ Chí Minh, Kronos không phải là nơi diễn ra các giao dịch thông thường, mà là một thánh đường của sự tinh xảo.',
            'Từ ánh sáng dịu nhẹ phản chiếu trên kính Sapphire đến không gian tư vấn riêng biệt, mọi chi tiết đều được thiết lập theo tiêu chuẩn quốc tế để mỗi vị khách đều cảm nhận được sự thượng lưu trong từng phút giây hiện diện.'
        ],
        atmosphereLabel: 'Không gian',
        atmosphereValue: 'Thánh đường của sự tinh xảo',
        locationLabel: 'Vị trí',
        locationValue: 'TP. Hồ Chí Minh',
        visitStore: 'Ghé thăm boutique',
        pillarsLabel: 'Giá trị cốt lõi',
        pillarsTitle: 'Những trụ cột của Kronos',
        pillars: [
            { title: 'Tính xác thực tuyệt đối', desc: 'Cam kết mang đến những cỗ máy thời gian xa xỉ chính hãng 100%, đầy đủ hộp, giấy tờ và bảo chứng từ nhà sản xuất.' },
            { title: 'Di sản bền vững', desc: 'Tuyển chọn những tuyệt phẩm quý giá, bền bỉ và có khả năng lưu giữ giá trị xuyên suốt thời gian, không gian và thế hệ.' },
            { title: 'Trải nghiệm độc quyền', desc: 'Đội ngũ đại sứ được đào tạo chuyên sâu, mang đến dịch vụ tư vấn cá nhân hóa và chăm sóc hậu mãi chuẩn quốc tế.' }
        ],
        epilogueLabel: 'Lời kết',
        epilogueQuote: '"Hơn cả một giao dịch — đó là cam kết về uy tín và giá trị bất tử."',
        founders: 'Những người sáng lập',
        city: 'TP. Hồ Chí Minh, Việt Nam'
    }
};

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

const AboutUsPage: React.FC = () => {
    const { i18n } = useTranslation();
    const lang = i18n.language.split('-')[0] === 'en' ? 'en' : 'vi';
    const content = aboutContent[lang];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;

    useSeo({
        pageKey: 'about-us',
        lang: lang,
        canonicalPath: '/about-us',
        structuredData: createBreadcrumbJsonLd(origin, [
            { name: 'Home', path: '/' },
            { name: 'About Us', path: '/about-us' },
        ]),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                        {YEAR_OF_FOUNDATION}
                    </span>
                </div>

                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto px-6"
                >
                    <motion.span 
                        key={`${lang}-kicker`}
                        variants={fadeUp} 
                        className="font-branding text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gunmetal/60 mb-8 block"
                    >
                        {content.heroKicker}
                    </motion.span>
                    <motion.h1 
                        key={`${lang}-title`}
                        variants={fadeUp} 
                        className="text-5xl md:text-7xl lg:text-8xl italic font-serif tracking-tight mb-10 leading-[1.1] text-gunmetal"
                    >
                        {content.heroTitle}
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-base md:text-lg font-light text-stone-500 leading-relaxed max-w-3xl">
                        {content.heroLead}
                    </motion.p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                >
                    <span className="font-branding text-[9px] tracking-[0.3em] uppercase text-gunmetal/40">{content.discover}</span>
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
                                key={`${lang}-chapter-label`}
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                                className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/40 font-bold mb-8 flex items-center gap-4"
                            >
                                {content.chapterOneLabel}
                                <span className="h-[1px] w-8 bg-gunmetal/20"></span>
                            </motion.span>

                            <motion.h2
                                key={`${lang}-chapter-title`}
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
                                className="text-3xl md:text-5xl font-light text-gunmetal mb-8 leading-tight"
                            >
                                {content.chapterOneTitle}
                            </motion.h2>

                            <motion.div
                                key={`${lang}-chapter-paragraphs`}
                                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                                className="space-y-6 text-[14px] md:text-[15px] font-light text-stone-500 leading-relaxed"
                            >
                                {content.chapterOneParagraphs.map((paragraph) => (
                                    <motion.p key={paragraph} variants={fadeUp}>
                                        {paragraph}
                                    </motion.p>
                                ))}
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
                            key={`${lang}-boutique-text`}
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                            className="max-w-lg"
                        >
                            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 leading-tight">
                                {content.chapterTwoTitle}
                            </motion.h2>
                            {content.chapterTwoParagraphs.map((paragraph) => (
                                <motion.p key={paragraph} variants={fadeUp} className="text-stone-400 font-light leading-relaxed mb-6 text-[15px]">
                                    {paragraph}
                                </motion.p>
                            ))}

                            {/* Architectural Spec Sheet */}
                            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10 mb-12">
                                <div>
                                    <span className="block font-branding text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">{content.atmosphereLabel}</span>
                                    <span className="block text-sm font-light text-white">{content.atmosphereValue}</span>
                                </div>
                                <div>
                                    <span className="block font-branding text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3">{content.locationLabel}</span>
                                    <span className="block text-sm font-light text-white">{content.locationValue}</span>
                                </div>
                            </motion.div>

                            <motion.button variants={fadeUp} className="group flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] font-branding hover:text-white transition-colors">
                                <span className="h-[1px] w-8 bg-white/30 group-hover:w-16 group-hover:bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                {content.visitStore}
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
                                key={`${lang}-boutique-img-wide`}
                                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: customEase }}
                                className="absolute top-0 right-0 w-[65%] aspect-[4/5] overflow-hidden rounded-lg bg-gunmetal"
                            >
                                <img src={`${import.meta.env.BASE_URL}DSC04308.jpg`} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-700" alt="Kronos Lounge" />
                            </motion.div>

                            {/* Image 2: The Medium Shot (Consultation Desk) - Overlaps bottom left */}
                            <motion.div
                                key={`${lang}-boutique-img-medium`}
                                initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2, ease: customEase }}
                                className="absolute bottom-10 left-[10%] w-[45%] aspect-[3/4] overflow-hidden rounded-lg border-[8px] border-gunmetal shadow-2xl z-20"
                            >
                                <img src={`${import.meta.env.BASE_URL}DSC04306.jpg`} className="w-full h-full object-cover" alt="Consultation Area" />
                            </motion.div>

                            {/* Image 3: The Macro Detail (Candle/Frame) - Overlaps top left */}
                            <motion.div
                                key={`${lang}-boutique-img-macro`}
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
                    key={`${lang}-pillars-header`}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="mb-16 md:mb-24 flex flex-col items-center text-center"
                >
                    <span className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/40 font-bold mb-6 flex items-center gap-4">
                        {content.pillarsLabel}
                    </span>
                    <h2 className="text-3xl md:text-4xl italic font-serif text-gunmetal">{content.pillarsTitle}</h2>
                </motion.div>

                <div className="flex flex-col">
                    {content.pillars.map((value, idx) => (
                        <motion.div
                            key={`${lang}-pillar-${idx}`}
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
                    key={`${lang}-epilogue-img`}
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
                        key={`${lang}-epilogue-text`}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: 0.2, ease: customEase }}
                        className="max-w-xl"
                    >
                        <span className="font-branding text-[10px] tracking-[0.5em] uppercase text-gunmetal/40 font-bold mb-10 flex items-center gap-4">
                            <span className="h-[1px] w-8 bg-gunmetal/20"></span>
                            {content.epilogueLabel}
                        </span>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl italic font-serif text-gunmetal leading-[1.15] mb-16">
                            {content.epilogueQuote}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-branding tracking-[0.3em] uppercase text-gunmetal">
                                {content.founders}
                            </span>
                            <span className="text-[13px] font-light text-stone-500">
                                {content.city}
                            </span>
                        </div>
                    </motion.div>
                </div>

            </section>

        </div>
    );
};

export default AboutUsPage;
