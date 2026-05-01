import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SpecValue from "@/components/common/SpecValue";
import type { Watch } from "@/types";

const SpecItem = ({ label, value, index }: { label: string; value: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
    >
        <p className="text-[9px] uppercase tracking-widest text-bone mb-1">{label}</p>
        <div>
            <SpecValue value={value} />
        </div>
    </motion.div>
);

const ThirdBrand = ({ watch }: { watch?: Watch }) => {
    const { t, i18n } = useTranslation();
    const lang = i18n.language.split('-')[0];
    const getLocalized = (baseValue?: string, enValue?: string | null) => lang === 'en' ? (enValue || baseValue || '') : (baseValue || enValue || '');

    if (!watch) return null;

    const description = getLocalized(watch.description, watch.description_en);
    const material = getLocalized(watch.material, watch.material_en);
    const movement = getLocalized(watch.movement, watch.movement_en);
    const strap = getLocalized(watch.strap, watch.strap_en);

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
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="order-1 space-y-8"
                >
                    <div className="space-y-4">
                        <motion.p variants={itemVariants} className="font-branding text-[11px] tracking-[0.3em] uppercase text-golden mb-4">{watch.brand}</motion.p>
                        <motion.h2 variants={itemVariants} className="text-5xl mb-6">{watch.collection || watch.name}</motion.h2>
                        <motion.h2 variants={itemVariants} className="text-xl mb-6 font-branding">REF. {watch.ref}</motion.h2>
                        <motion.p variants={itemVariants} className="text-gunmetal leading-relaxed max-w-md">{description}</motion.p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-bone/30 pt-8">
                        {watch.size && <SpecItem label={t('watch.specs.size', 'Size')} value={watch.size} index={0} />}
                        {material && <SpecItem label={t('watch.specs.material', 'Material')} value={material} index={1} />}
                        {movement && <SpecItem label={t('watch.specs.movement', 'Movement')} value={movement} index={2} />}
                        {strap && <SpecItem label={t('watch.specs.strap', 'Strap')} value={strap} index={3} />}
                    </div>
                    <motion.div variants={itemVariants}>
                        <Link to={`/watch/${watch.id}`} className="inline-block px-6 py-3 font-branding bg-stormy text-white text-[11px] tracking-widest uppercase hover:bg-opacity-90 transition-all rounded-lg">
                            {t('home.featured.discoverModel', 'Discover the Model')}
                        </Link>
                    </motion.div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
                    className="order-2 aspect-square overflow-hidden rounded-2xl"
                >
                    <img alt={watch.name} className="w-full h-full object-cover shadow-2xl"
                        src={watch.image} />
                </motion.div>
            </div>
        </section>
    );
}

export default ThirdBrand;