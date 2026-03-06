import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import type { Variants, Easing } from 'framer-motion';
import { CONTACT_ADDRESS, CONTACT_EMAIL, CONTACT_PHONE } from '@/utils';

const ContactUsPage: React.FC = () => {
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

    // Parallax hook for the hero text
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
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
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                        className="flex flex-col bg-stone-50 p-8 md:p-12 lg:p-16 rounded-lg"
                    >
                        <motion.h3 variants={fadeUp} className="text-2xl md:text-3xl font-serif italic text-gunmetal mb-2">
                            Send an Inquiry
                        </motion.h3>
                        <motion.p variants={fadeUp} className="text-sm text-stone-500 font-light mb-12">
                            Please allow up to 24 hours for a personalized response.
                        </motion.p>

                        <form className="flex flex-col gap-8 md:gap-10">
                            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                                <div className="relative group">
                                    <input type="text" id="firstName" required className="w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-gunmetal outline-none focus:border-gunmetal transition-colors peer" placeholder=" " />
                                    <label htmlFor="firstName" className="absolute left-0 top-3 text-sm font-light text-stone-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-gunmetal peer-focus:uppercase peer-focus:tracking-[0.2em] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-gunmetal peer-valid:uppercase peer-valid:tracking-[0.2em] pointer-events-none">
                                        First Name *
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input type="text" id="lastName" required className="w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-gunmetal outline-none focus:border-gunmetal transition-colors peer" placeholder=" " />
                                    <label htmlFor="lastName" className="absolute left-0 top-3 text-sm font-light text-stone-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-gunmetal peer-focus:uppercase peer-focus:tracking-[0.2em] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-gunmetal peer-valid:uppercase peer-valid:tracking-[0.2em] pointer-events-none">
                                        Last Name *
                                    </label>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeUp} className="relative group">
                                <input type="email" id="email" required className="w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-gunmetal outline-none focus:border-gunmetal transition-colors peer" placeholder=" " />
                                <label htmlFor="email" className="absolute left-0 top-3 text-sm font-light text-stone-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-gunmetal peer-focus:uppercase peer-focus:tracking-[0.2em] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-gunmetal peer-valid:uppercase peer-valid:tracking-[0.2em] pointer-events-none">
                                    Email Address *
                                </label>
                            </motion.div>

                            <motion.div variants={fadeUp} className="relative group">
                                <select id="inquiryType" required className="w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-stone-500 outline-none focus:border-gunmetal transition-colors appearance-none cursor-pointer">
                                    <option value="" disabled selected>Select Subject</option>
                                    <option value="acquisition">Timepiece Acquisition</option>
                                    <option value="appointment">Book an Appointment</option>
                                    <option value="service">After-Sales Service & Repair</option>
                                    <option value="other">General Inquiry</option>
                                </select>
                            </motion.div>

                            <motion.div variants={fadeUp} className="relative group">
                                <textarea id="message" required rows={4} className="w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-gunmetal outline-none focus:border-gunmetal transition-colors peer resize-none" placeholder=" "></textarea>
                                <label htmlFor="message" className="absolute left-0 top-3 text-sm font-light text-stone-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-gunmetal peer-focus:uppercase peer-focus:tracking-[0.2em] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-gunmetal peer-valid:uppercase peer-valid:tracking-[0.2em] pointer-events-none">
                                    Your Message
                                </label>
                            </motion.div>

                            <motion.button variants={fadeUp} type="submit" className="group mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gunmetal w-fit">
                                <span className="h-[1px] w-8 bg-gunmetal/30 group-hover:w-16 group-hover:bg-gunmetal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                Send Message
                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Right: Direct Contact & Imagery */}
                    <div className="flex flex-col h-full justify-between gap-12">
                        
                        {/* The Consultation Desk Image */}
                        <motion.div 
                            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, ease: customEase }}
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
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
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
                            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: customEase }}
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
                            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
                        >
                            <motion.span variants={fadeUp} className="font-branding text-[10px] tracking-[0.4em] uppercase text-gunmetal/40 font-bold mb-6 block">
                                The Flagship
                            </motion.span>
                            
                            <motion.h2 variants={fadeUp} className="italic text-3xl md:text-5xl font-light text-gunmetal mb-8 leading-tight">
                                Kronos Luxury Timepieces
                            </motion.h2>

                            <motion.div variants={fadeUp} className="flex items-start gap-4 mb-8">
                                <MapPin size={20} className="text-gunmetal/40 shrink-0 mt-1" strokeWidth={1.5} />
                                <p className="text-[14px] md:text-[15px] font-light text-stone-500 leading-relaxed">
                                    {CONTACT_ADDRESS}
                                </p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="flex items-start gap-4 mb-12 pb-12 border-b border-gunmetal/10">
                                <Clock size={20} className="text-gunmetal/40 shrink-0 mt-1" strokeWidth={1.5} />
                                <div className="text-[14px] md:text-[15px] font-light text-stone-500 leading-relaxed">
                                    <p className="text-gunmetal font-medium mb-1">Hours of Operation</p>
                                    <p>Monday – Saturday: 10:00 AM – 8:00 PM</p>
                                    <p>Sunday: By Private Appointment Only</p>
                                </div>
                            </motion.div>

                            <motion.button variants={fadeUp} className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gunmetal">
                                <span className="h-[1px] w-8 bg-gunmetal/30 group-hover:w-16 group-hover:bg-gunmetal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                                Get Directions
                            </motion.button>
                        </motion.div>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default ContactUsPage;