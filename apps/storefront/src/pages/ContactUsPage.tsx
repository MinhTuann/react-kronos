import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle2, MapPin, Phone, Mail, Clock } from 'lucide-react';
import type { Variants, Easing } from 'framer-motion';
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE, MAP_URL } from '@/utils';
import { createBreadcrumbJsonLd, useSeo } from '@/seo';
import { useTranslation } from 'react-i18next';
import ContactInquiryForm from '@/components/contact/ContactInquiryForm';

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

const ContactUsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language.split('-')[0];
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin;
    const [isInquiryToastVisible, setIsInquiryToastVisible] = useState(false);

    useSeo({
        pageKey: 'contact-us',
        lang: currentLang,
        canonicalPath: '/contact-us',
        structuredData: createBreadcrumbJsonLd(origin, [
            { name: 'Home', path: '/' },
            { name: t('common.contactUs'), path: '/contact-us' },
        ]),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isInquiryToastVisible) return;

        const timeout = window.setTimeout(() => {
            setIsInquiryToastVisible(false);
        }, 5000);

        return () => window.clearTimeout(timeout);
    }, [isInquiryToastVisible]);

    // Parallax hook for the hero text
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    });
    const heroY = useTransform(heroScroll, [0, 1], [0, 150]);
    const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

    return (
        <div className="bg-white text-gunmetal overflow-hidden selection:bg-gunmetal selection:text-white pb-24">
            
            {/* --- 1. The Hero Section --- */}
            <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20">
                {/* Architectural Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0">
                    <span className="font-branding text-[12vw] leading-none tracking-tighter text-stone-50 font-bold">
                        CONCIERGE
                    </span>
                </div>

                <motion.div 
                    style={{ y: heroY, opacity: heroOpacity }}
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer}
                    className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6"
                >
                    <motion.span variants={fadeUp} className="font-branding text-[10px] md:text-[11px] tracking-[0.4em] uppercase text-gunmetal/60 mb-8 block flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-gunmetal/20"></span>
                        Client Relations
                        <span className="w-8 h-[1px] bg-gunmetal/20"></span>
                    </motion.span>
                    <motion.h1 variants={fadeUp} className="text-5xl md:text-6xl lg:text-7xl italic font-serif tracking-tight mb-8 leading-[1.1] text-gunmetal">
                        We are at your <br className="hidden md:block"/> disposal.
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-[14px] md:text-[15px] font-light text-stone-500 leading-relaxed max-w-lg">
                        Whether you are seeking a specific timepiece, require servicing, or wish to book a private consultation, our ambassadors are here to assist you.
                    </motion.p>
                </motion.div>
            </section>

            {/* --- 2. The Main Contact Interface --- */}
            <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24 md:pb-40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: The Editorial Form */}
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}
                        className="flex flex-col bg-stone-50 p-8 md:p-12 lg:p-16 rounded-lg"
                    >
                        <ContactInquiryForm
                            variants={fadeUp}
                            showInlineSuccess={false}
                            onSuccess={() => setIsInquiryToastVisible(true)}
                        />
                    </motion.div>

                    {/* Right: Direct Contact & Imagery */}
                    <div className="flex flex-col h-full justify-between gap-12">

                        {/* The Consultation Desk Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1.2, ease: customEase }}
                            className="w-full aspect-[4/3] lg:aspect-auto lg:flex-1 overflow-hidden rounded-lg"
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}DSC04306.jpg`}
                                alt="Kronos Consultation Desk"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s] ease-out"
                            />
                        </motion.div>

                        {/* Contact Information Grid */}
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12"
                        >
                            <motion.div variants={fadeUp} className="flex flex-col">
                                <div className="flex items-center gap-3 mb-4 text-gunmetal">
                                    <Phone size={16} strokeWidth={1.5} />
                                    <span className="font-branding text-[10px] uppercase tracking-[0.3em] font-bold">Phone</span>
                                </div>
                                <a href={`tel:${CONTACT_PHONE}`} className="text-sm font-light text-stone-500 hover:text-black transition-colors mb-1">
                                    {CONTACT_PHONE}
                                </a>
                                <span className="text-[12px] font-light text-stone-400 italic">WhatsApp Available</span>
                            </motion.div>

                            <motion.div variants={fadeUp} className="flex flex-col">
                                <div className="flex items-center gap-3 mb-4 text-gunmetal">
                                    <Mail size={16} strokeWidth={1.5} />
                                    <span className="font-branding text-[10px] uppercase tracking-[0.3em] font-bold">Email</span>
                                </div>
                                <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm font-light text-stone-500 hover:text-black transition-colors border-b border-transparent hover:border-black w-fit pb-0.5">
                                    {CONTACT_EMAIL}
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* --- 3. The Boutique Location --- */}
            <section className="max-w-[1600px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-gunmetal/10 pt-16 md:pt-24 gap-12 lg:gap-0 items-center">

                    {/* Location Image */}
                    <div className="lg:col-span-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 1, ease: customEase }}
                            className="aspect-[2/3] w-full lg:w-[85%] bg-stone-100 overflow-hidden rounded-lg"
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}DSC04304.jpg`}
                                alt="Kronos Boutique Entrance"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    </div>

                    {/* Location Details */}
                    <div className="lg:col-span-6 flex flex-col justify-center lg:pl-12 xl:pl-24">
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer}
                        >
                            <motion.span variants={fadeUp} className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/40 font-bold mb-6 block">
                                The Flagship
                            </motion.span>

                            <motion.h2 variants={fadeUp} className="italic text-3xl md:text-5xl font-light text-gunmetal mb-8 leading-tight">
                                Kronos Luxury Timepieces
                            </motion.h2>

                            <motion.a
                                href={MAP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={fadeUp}
                                className="flex items-start gap-4 mb-8 group cursor-pointer"
                            >
                                <MapPin size={20} className="text-gunmetal/40 group-hover:text-gunmetal shrink-0 mt-1 transition-colors" strokeWidth={1.5} />
                                <p className="text-[14px] md:text-[15px] font-light text-stone-500 group-hover:text-gunmetal leading-relaxed transition-colors">
                                    {CONTACT_ADDRESS}
                                </p>
                            </motion.a>

                            <motion.div variants={fadeUp} className="flex items-start gap-4 mb-12 pb-12 border-b border-gunmetal/10">
                                <Clock size={20} className="text-gunmetal/40 shrink-0 mt-1" strokeWidth={1.5} />
                                <div className="text-[14px] md:text-[15px] font-light text-stone-500 leading-relaxed">
                                    <p className="text-gunmetal font-medium mb-1">Hours of Operation</p>
                                    <p>Monday – Saturday: 10:00 AM – 8:00 PM</p>
                                    <p>Sunday: By Private Appointment Only</p>
                                </div>
                            </motion.div>

                            <motion.a
                                href={MAP_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={fadeUp}
                                className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gunmetal"
                            >
                                <span className="h-[1px] w-8 bg-gunmetal/30 group-hover:w-16 group-hover:bg-gunmetal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                Get Directions
                            </motion.a>
                        </motion.div>
                    </div>

                </div>
            </section>

            <AnimatePresence>
                {isInquiryToastVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-6 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-lg border border-green-200 bg-white px-4 py-4 text-gunmetal shadow-2xl sm:right-6 sm:left-auto sm:w-full sm:translate-x-0"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-700">
                            <CheckCircle2 size={18} />
                        </span>
                        <span>
                            <span className="block text-sm font-medium">{t('contactForm.contactToastTitle')}</span>
                            <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                                {t('contactForm.contactToastDescription')}
                            </span>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default ContactUsPage;
