import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OurStory = ({ data }: { data?: any }) => {
    // Fallback to existing mock data if no data provided
    const content = data || {
        title: "The Kronos Story",
        quote: "Time is not merely measured; it is crafted with intent and preserved with honor.",
        paragraph1: "For generations, our master watchmakers have dedicated their lives to the pursuit of horological perfection. Founded in the heart of the Swiss Jura mountains, Chronos began as a small atelier driven by a singular vision: to create timepieces that transcend the fleeting nature of trends.",
        paragraph2: "Today, we blend centuries-old craftsmanship with modern innovation, ensuring every movement that leaves our workshop is a masterpiece of precision and a legacy for the future.",
        features: [
            { title: "Precision", icon: "target", description: "Accuracy down to the millisecond, achieved through rigorous testing and impeccable movement calibration." },
            { title: "Innovation", icon: "lightbulb", description: "Constantly pushing the boundaries of what's possible in horology while respecting the laws of traditional mechanics." },
            { title: "Timelessness", icon: "hourglass", description: "Designs that transcend generations, maintaining their aesthetic appeal and functional excellence for decades." }
        ]
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const }
        }
    };

    return (
        <>
            <section className='bg-vanilla/10 overflow-hidden'>
                <div className='w-screen grid grid-cols-1 md:grid-cols-2 gap-16 px-8 md:px-32 py-16 md:py-32'>
                    <div className='order-1 w-full flex justify-center items-center'>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
                            className='relative w-[80dvw] md:w-[420px] aspect-[2/3]'
                        >
                            <motion.img
                                initial={{ scale: 1.1 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: "easeOut" }}
                                src={`${import.meta.env.BASE_URL}DSC04304.jpg`}
                                className='absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg' />
                            <motion.img
                                initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                                src={`${import.meta.env.BASE_URL}DSC04299.jpg`}
                                className='absolute -bottom-6 -right-6 w-[30dvw] md:w-[140px] aspect-[2/3] object-cover rounded-xl border-4 border-white shadow-xl' />
                        </motion.div>
                    </div>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                        className='order-2 space-y-8'
                    >
                        <div className='space-y-4'>
                            <motion.h2 variants={itemVariants} className='font-branding text-4xl md:text-5xl text-gunmetal leading-tight'>{content.title}</motion.h2>
                            <motion.div variants={itemVariants} className='w-20 h-1 bg-stormy' />
                        </div>
                        <motion.p variants={itemVariants} className='text-lg text-bone leading-relaxed italic'>
                            "{content.quote}"
                        </motion.p>
                        <motion.p variants={itemVariants} className='leading-relaxed'>
                            {content.paragraph1}
                        </motion.p>
                        <motion.p variants={itemVariants} className='leading-relaxed'>
                            {content.paragraph2}
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <Link to='/about-us' className='font-branding text-stormy uppercase tracking-widest inline-flex items-center gap-2 hover:gap-4 transition-all'>
                                Discover Our Heritage <span className='material-symbols-outlined'>arrow_forward</span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            <section className='py-20 px-6 md:px-20 bg-bone/10'>
                <div className='max-w-7xl mx-auto'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        className='grid grid-cols-1 md:grid-cols-3 gap-12'
                    >
                        {content.features?.map((feature: any, idx: number) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
                                    }
                                }}
                                className='text-center space-y-4 group'
                            >
                                <div
                                    className='w-16 h-16 bg-stormy/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-stormy group-hover:text-white transition-all duration-300'>
                                    <span className='material-symbols-outlined text-3xl font-extralight'>{feature.icon}</span>
                                </div>
                                <h3 className='text-2xl text-gunmetal'>{feature.title}</h3>
                                <p className='text-slate-600 leading-relaxed'>{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </>
    );
}

export default OurStory;