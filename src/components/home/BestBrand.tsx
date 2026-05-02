import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SpecValue from "@/components/common/SpecValue";
import type { Watch } from "@/types";

const SpecItem = ({ label, value, index }: { label: string; value: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
        className='flex flex-col space-y-1 md:items-end'
    >
        <h1 className='font-branding text-vanilla text-[10px] tracking-[0.3em] uppercase'>{label}</h1>
        <div className='text-white text-[15px] font-light md:text-right'>
            <SpecValue value={value} className='md:inline-block md:text-left' bulletClassName='pl-1' />
        </div>
    </motion.div>
);

const BestBrand = ({ watch }: { watch?: Watch }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.split('-')[0];
    const getLocalized = (baseValue?: string, enValue?: string | null) => lang === 'en' ? (enValue || baseValue || '') : (baseValue || enValue || '');

    if (!watch) return null;

    const description = getLocalized(watch.description, watch.description_en);
    const material = getLocalized(watch.material, watch.material_en);
    const movement = getLocalized(watch.movement, watch.movement_en);
    const strap = getLocalized(watch.strap, watch.strap_en);

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
                alt={watch.name}
                className='absolute inset-0 w-full h-full object-cover'
                src={watch.image}
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
                    <motion.span variants={itemVariants} className='font-branding text-[11px] tracking-[0.4em] uppercase text-vanilla font-semibold'>{watch.brand}</motion.span>

                    <motion.div variants={itemVariants} className='space-y-2'>
                        <h2 className='text-3xl md:text-4xl text-white border-l-2 border-vanilla pl-4 leading-tight uppercase'>{watch.collection || watch.name}</h2>
                        <h4 className='text-lg md:text-xl text-white/70 pl-4 font-branding'>REF. {watch.ref}</h4>
                    </motion.div>

                    <motion.p variants={itemVariants} className='text-white/80 leading-relaxed max-w-lg'>
                        {description}
                    </motion.p>

                    <motion.div variants={itemVariants}>
                        <Link to={`/watch/${watch.id}`} className='inline-block w-full md:w-auto text-center px-6 py-3 bg-white text-stormy text-[8px] tracking-widest uppercase font-branding hover:bg-opacity-90 transition-all rounded-lg'>
                            {t('home.featured.exploreIcon', 'Explore the Icon')}
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Column: Specifications */}
                <div className='flex flex-col justify-end md:items-end'>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-8 md:ml-0 lg:ml-32'>
                        {watch.size && <SpecItem label={t('watch.specs.size', 'Size')} value={watch.size} index={0} />}
                        {material && <SpecItem label={t('watch.specs.material', 'Material')} value={material} index={1} />}
                        {movement && <SpecItem label={t('watch.specs.movement', 'Movement')} value={movement} index={2} />}
                        {strap && <SpecItem label={t('watch.specs.strap', 'Strap')} value={strap} index={3} />}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BestBrand;