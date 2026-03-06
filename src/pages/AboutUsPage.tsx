import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const AboutUsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fadeInUp: any = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="pt-24 md:pt-32 pb-24 min-h-screen bg-white">
            {/* Hero Section */}
            <section className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-20 md:mb-32">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer}
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                    <motion.span variants={fadeInUp} className="font-branding text-[10px] tracking-[0.4em] uppercase text-golden mb-6 block">
                        Our Heritage
                    </motion.span>
                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl italic text-gunmetal tracking-tight mb-8 leading-tight">
                        A Legacy of Precision<br />and Elegance
                    </motion.h1>
                    <motion.div variants={fadeInUp} className="w-16 h-1 bg-golden mb-8"></motion.div>
                    <motion.p variants={fadeInUp} className="text-base md:text-lg font-light text-gunmetal/70 leading-relaxed">
                        Since our inception, Kronos has been dedicated to the pursuit of horological perfection. We craft more than just watches; we create timeless companions that tell the story of generations.
                    </motion.p>
                </motion.div>
            </section>

            {/* Image Grid Section */}
            <section className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-20 md:mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any}
                        className="aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden relative group"
                    >
                        {/* Using placeholder image since we don't have many real assets */}
                        <img 
                            src={`${import.meta.env.BASE_URL}DSC04304.jpg`} 
                            alt="Watchmaker at work" 
                            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            onError={(e) => {
                                // Fallback if image doesn't exist
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://thekronos.vn/public/uploads/product/hxwQ_5119-51891.avif';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:bg-black/20"></div>
                    </motion.div>
                    <div className="flex flex-col justify-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any}
                        >
                            <h2 className="text-3xl md:text-4xl font-light text-gunmetal mb-6">Mastery of the Craft</h2>
                            <p className="text-base font-light text-gunmetal/70 leading-relaxed mb-6">
                                Every Kronos timepiece is the result of hundreds of hours of meticulous labor by master craftsmen. From the intricate assembly of the movement to the final polish of the case, our dedication to excellence is unwavering.
                            </p>
                            <p className="text-base font-light text-gunmetal/70 leading-relaxed">
                                We source only the finest materials—surgical-grade stainless steel, 18k gold, platinum, and flawless gemstones—to ensure that each watch meets our rigorous standards of quality and beauty.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-stone-50 py-20 md:py-32">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl italic text-gunmetal tracking-tight mb-4">Our Core Values</h2>
                        <div className="w-12 h-[1px] bg-golden mx-auto"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                        {[
                            { title: 'Tradition', desc: 'Respecting the centuries-old techniques of Swiss watchmaking while looking towards the future.' },
                            { title: 'Innovation', desc: 'Constantly pushing the boundaries of mechanical possibility and design aesthetics.' },
                            { title: 'Exclusivity', desc: 'Producing limited quantities to ensure that every owner possesses a truly unique creation.' }
                        ].map((value, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                                className="flex flex-col items-center text-center"
                            >
                                <span className="text-4xl font-serif italic text-golden/30 mb-6">{`0${idx + 1}`}</span>
                                <h3 className="text-xl font-medium text-gunmetal mb-4 uppercase tracking-widest">{value.title}</h3>
                                <p className="text-sm font-light text-gunmetal/70 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Conclusion */}
            <section className="max-w-4xl mx-auto px-6 lg:px-12 py-20 md:py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="text-2xl md:text-3xl italic font-serif text-gunmetal/80 leading-relaxed mb-8">
                        "To wear a Kronos is to carry a piece of eternity on your wrist."
                    </p>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-gunmetal border-b border-gunmetal pb-1">
                        The Founders
                    </span>
                </motion.div>
            </section>
        </div>
    );
};

export default AboutUsPage;
