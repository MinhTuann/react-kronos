import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SpecItem = ({ label, value, index }: { label: string; value: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
    >
        <p className="font-branding text-[9px] uppercase tracking-widest text-bone mb-1">{label}</p>
        <p>{value}</p>
    </motion.div>
);

const SecondBrand = () => {
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
        }
    };

    return (
        <section className="py-12 md:py-24 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                    className="order-2 md:order-1 aspect-square overflow-hidden rounded-2xl"
                >
                    <img alt="Watchmaker at work" className="w-full h-full object-cover shadow-2xl"
                        src={`${import.meta.env.BASE_URL}richard_mile_rm4101.png`} />
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="order-1 md:order-2 space-y-8"
                >
                    <div className="space-y-4">
                        <motion.p variants={itemVariants} className="font-branding text-[11px] tracking-[0.3em] uppercase text-golden mb-4">Richard Mille</motion.p>
                        <motion.h2 variants={itemVariants} className="text-5xl mb-6">CALIBRE</motion.h2>
                        <motion.h2 variants={itemVariants} className="text-xl mb-6 font-branding">REF. RM41-01</motion.h2>
                        <motion.p variants={itemVariants} className="text-gunmetal leading-relaxed max-w-md">Richard Mille’s relationship with the world of soccer started with the RM 11-01 and the RM 11-04 Roberto Mancini, which introduced an innovative match-time display. Taking this daring concept even further, the new RM 41-01 Tourbillon Soccer tackles a unique challenge: fully tracking a match through the prism of Haute Horlogerie: from kick-off to the final whistle, taking note of every goal.</motion.p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-bone/30 pt-8">
                        <SpecItem label='Size' value='41 mm' index={0} />
                        <SpecItem label='Material' value='White Gold' index={1} />
                        <SpecItem label='Movement' value='Manual' index={2} />
                        <SpecItem label='Strap' value='Alligator' index={3} />
                    </div>
                    <motion.div variants={itemVariants}>
                        <Link to='/watch/2' className="inline-block px-6 py-3 font-branding bg-stormy text-white text-[11px] tracking-widest uppercase hover:bg-opacity-90 transition-all rounded-lg">
                            Discover the Model
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

export default SecondBrand;