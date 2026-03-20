import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const SpecItem = ({ label, value, index }: { label: string; value: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
        className='flex flex-col space-y-1 md:items-end'
    >
        <h1 className='font-branding text-vanilla text-[10px] tracking-[0.3em] uppercase'>{label}</h1>
        <p className='text-white text-[15px] font-light md:text-right'>{value}</p>
    </motion.div>
);

const BestBrand = () => {
    // Stagger container variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
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
        <section className='w-full min-h-[600px] md:h-auto md:aspect-[16/6] overflow-hidden relative'>
            {/* Background Image with Zoom-out Effect */}
            <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.8 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: "easeOut" }}
                alt='Best Seller Watch Close-up'
                className='absolute inset-0 w-full h-full object-cover'
                src={`${import.meta.env.BASE_URL}patek_philippe_7140G001.jpeg`}
            />
            <div className='absolute inset-0 bg-black/70'></div>

            {/* Content Container */}
            <div className='relative z-10 w-full h-full px-8 py-16 md:px-32 md:py-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32'>

                {/* Left Column: Branding & Main CTA */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className='flex flex-col space-y-8 md:justify-between h-full'
                >
                    <motion.span variants={itemVariants} className='font-branding text-[11px] tracking-[0.4em] uppercase text-vanilla font-semibold'>Patek Philippe</motion.span>

                    <motion.div variants={itemVariants} className='space-y-2'>
                        <h2 className='text-3xl md:text-4xl text-white border-l-2 border-vanilla pl-4 leading-tight'>GRAND COMPLICATIONS</h2>
                        <h4 className='text-lg md:text-xl text-white/70 pl-4 italic'>REF. 7140G-001</h4>
                    </motion.div>

                    <motion.p variants={itemVariants} className='text-white/80 leading-relaxed max-w-lg'>
                        Patek Philippe pays tribute to women's increased interest in beautiful, complicated watches with a perpetual calendar associating technical refinement...
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <Link to='/watch/1' className='inline-block w-full md:w-auto text-center px-6 py-3 bg-white text-stormy text-[8px] tracking-widest uppercase font-branding hover:bg-opacity-90 transition-all rounded-lg'>
                            Explore the Icon
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Column: Specifications */}
                <div className='flex flex-col justify-end md:items-end'>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-8 md:ml-0 lg:ml-32'>
                        <SpecItem label='Size' value='35.1 mm' index={0} />
                        <SpecItem label='Material' value='White Gold' index={1} />
                        <SpecItem label='Movement' value='Automatic (240 Q)' index={2} />
                        <SpecItem label='Strap' value='Alligator Leather' index={3} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BestBrand;