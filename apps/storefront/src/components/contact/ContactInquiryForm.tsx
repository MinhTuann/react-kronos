import React, { useId, useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Watch } from '@/types';
import { publicApi } from '@/lib/api';
import type { ContactRequestPurpose } from '@/lib/api';

interface ContactInquiryFormProps {
    title?: string;
    subtitle?: string;
    selectedWatch?: Watch | null;
    defaultPurpose?: ContactRequestPurpose;
    variants?: Variants;
    density?: 'default' | 'compact';
    onSuccess?: () => void;
    showInlineSuccess?: boolean;
}

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    purpose: ContactRequestPurpose | '';
    message: string;
}

const purposeLabelKeys: Record<ContactRequestPurpose, string> = {
    timepiece_acquisition: 'contactForm.purposes.timepieceAcquisition',
    appointment: 'contactForm.purposes.appointment',
    service: 'contactForm.purposes.service',
    general: 'contactForm.purposes.general',
};

const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};

const inputClass = 'w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-gunmetal outline-none focus:border-gunmetal transition-colors peer';
const labelClass = 'absolute left-0 top-3 text-sm font-light text-stone-400 transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-gunmetal peer-focus:uppercase peer-focus:tracking-[0.2em] peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:text-gunmetal peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-[0.2em] pointer-events-none';

const ContactInquiryForm: React.FC<ContactInquiryFormProps> = ({
    title,
    subtitle,
    selectedWatch,
    defaultPurpose = 'general',
    variants,
    density = 'default',
    onSuccess,
    showInlineSuccess = true,
}) => {
    const { t } = useTranslation();
    const idPrefix = useId();
    const isCompact = density === 'compact';
    const lockedPurpose = selectedWatch ? 'timepiece_acquisition' : null;
    const [formData, setFormData] = useState<ContactFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        purpose: lockedPurpose || defaultPurpose,
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

    const updateField = <Field extends keyof ContactFormData>(field: Field, value: ContactFormData[Field]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (submitState !== 'idle') {
            setSubmitState('idle');
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitState('idle');
        let didSubmit = false;

        try {
            await publicApi.createContactRequest({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                purpose: (lockedPurpose || formData.purpose) as ContactRequestPurpose,
                message: formData.message,
                source_path: window.location.pathname,
                selected_watch: selectedWatch ? {
                    id: String(selectedWatch.id),
                    brand: selectedWatch.brand,
                    collection: selectedWatch.collection,
                    name: selectedWatch.name,
                    ref: selectedWatch.ref,
                    image: selectedWatch.image,
                    price: selectedWatch.price || null,
                    url: selectedWatch.canonical_url || window.location.href,
                } : null,
            });

            didSubmit = true;
            setSubmitState('success');
            setFormData(prev => ({
                ...prev,
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                message: '',
                purpose: lockedPurpose || defaultPurpose,
            }));
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
            setSubmitState('error');
        } finally {
            setIsSubmitting(false);
        }

        if (didSubmit) {
            onSuccess?.();
        }
    };

    const watchPrice = formatPrice(selectedWatch?.price);
    const formTitle = title || t('contactForm.title');
    const formSubtitle = subtitle || t('contactForm.subtitle');
    const purposeLabels: Record<ContactRequestPurpose, string> = {
        timepiece_acquisition: t(purposeLabelKeys.timepiece_acquisition),
        appointment: t(purposeLabelKeys.appointment),
        service: t(purposeLabelKeys.service),
        general: t(purposeLabelKeys.general),
    };
    const titleClass = isCompact
        ? 'text-2xl font-serif italic text-gunmetal mb-1 pr-12'
        : 'text-2xl md:text-3xl font-serif italic text-gunmetal mb-2';
    const subtitleClass = isCompact
        ? 'text-sm text-stone-500 font-light mb-5 pr-12'
        : 'text-sm text-stone-500 font-light mb-8';
    const selectedWatchClass = isCompact
        ? 'mb-5 rounded-lg border border-gunmetal/10 bg-white/70 p-3 flex gap-3'
        : 'mb-10 rounded-lg border border-gunmetal/10 bg-white/70 p-4 flex gap-4';
    const selectedWatchImageClass = isCompact
        ? 'w-16 h-20 rounded bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center'
        : 'w-20 h-24 rounded bg-stone-100 overflow-hidden shrink-0 flex items-center justify-center';
    const formClass = isCompact ? 'flex flex-col gap-5' : 'flex flex-col gap-8 md:gap-10';
    const fieldGridClass = isCompact
        ? 'grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6'
        : 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10';
    const submitClass = isCompact
        ? 'group mt-1 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gunmetal w-fit disabled:opacity-50 disabled:cursor-not-allowed'
        : 'group mt-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gunmetal w-fit disabled:opacity-50 disabled:cursor-not-allowed';

    if (isCompact && selectedWatch) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6">
                <aside className="rounded-lg border border-gunmetal/10 bg-white p-5 flex flex-col">
                    <p className="font-branding text-[10px] uppercase tracking-[0.32em] text-golden">
                        {t('contactForm.boutiqueRequest')}
                    </p>
                    <div className="mt-5 aspect-[4/5] rounded-lg bg-stone-50 flex items-center justify-center overflow-hidden">
                        <img
                            src={selectedWatch.image}
                            alt={selectedWatch.name}
                            className="h-full w-full object-contain p-5 drop-shadow-xl"
                        />
                    </div>
                    <div className="mt-5 border-t border-gunmetal/10 pt-4">
                        <p className="font-branding text-[10px] uppercase tracking-[0.28em] text-gunmetal/40 mb-2">
                            {t('contactForm.selectedTimepiece')}
                        </p>
                        <h4 className="text-base font-medium text-gunmetal leading-snug">
                            {selectedWatch.brand} {selectedWatch.name}
                        </h4>
                        <p className="mt-2 text-xs text-stone-500 leading-relaxed">
                            {selectedWatch.collection}
                            {selectedWatch.ref ? ` | Ref. ${selectedWatch.ref}` : ''}
                        </p>
                        {watchPrice && (
                            <p className="mt-3 text-sm font-serif text-gunmetal">{watchPrice}</p>
                        )}
                    </div>
                    <div className="mt-auto pt-5">
                        <div className="rounded-lg border border-golden/20 bg-stone-50 px-4 py-3">
                            <p className="font-branding text-[9px] uppercase tracking-[0.28em] text-gunmetal/40">
                                {t('contactForm.fields.purpose')}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gunmetal">{purposeLabels.timepiece_acquisition}</p>
                        </div>
                    </div>
                </aside>

                <section className="relative flex flex-col justify-center py-1 pr-1">
                    <motion.h3 variants={variants} className="text-2xl md:text-3xl font-serif italic text-gunmetal mb-1 pr-12">
                        {formTitle}
                    </motion.h3>
                    <motion.p variants={variants} className="text-sm text-stone-500 font-light mb-7 pr-12 max-w-lg">
                        {formSubtitle}
                    </motion.p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <motion.div variants={variants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    id={`${idPrefix}-firstName`}
                                    required
                                    value={formData.first_name}
                                    onChange={event => updateField('first_name', event.target.value)}
                                    className={inputClass}
                                    placeholder=" "
                                />
                                <label htmlFor={`${idPrefix}-firstName`} className={labelClass}>{t('contactForm.fields.firstName')} *</label>
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    id={`${idPrefix}-lastName`}
                                    required
                                    value={formData.last_name}
                                    onChange={event => updateField('last_name', event.target.value)}
                                    className={inputClass}
                                    placeholder=" "
                                />
                                <label htmlFor={`${idPrefix}-lastName`} className={labelClass}>{t('contactForm.fields.lastName')} *</label>
                            </div>
                        </motion.div>

                        <motion.div variants={variants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <input
                                    type="tel"
                                    id={`${idPrefix}-phone`}
                                    required
                                    value={formData.phone}
                                    onChange={event => updateField('phone', event.target.value)}
                                    className={inputClass}
                                    placeholder=" "
                                />
                                <label htmlFor={`${idPrefix}-phone`} className={labelClass}>{t('contactForm.fields.phone')} *</label>
                            </div>
                            <div className="relative group">
                                <input
                                    type="email"
                                    id={`${idPrefix}-email`}
                                    value={formData.email}
                                    onChange={event => updateField('email', event.target.value)}
                                    className={inputClass}
                                    placeholder=" "
                                />
                                <label htmlFor={`${idPrefix}-email`} className={labelClass}>{t('contactForm.fields.email')}</label>
                            </div>
                        </motion.div>

                        <motion.div variants={variants} className="relative group">
                            <textarea
                                id={`${idPrefix}-message`}
                                required
                                rows={3}
                                value={formData.message}
                                onChange={event => updateField('message', event.target.value)}
                                className={`${inputClass} resize-none`}
                                placeholder=" "
                            />
                            <label htmlFor={`${idPrefix}-message`} className={labelClass}>{t('contactForm.fields.message')} *</label>
                        </motion.div>

                        {showInlineSuccess && submitState === 'success' && (
                            <motion.div variants={variants} className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                <CheckCircle2 size={18} />
                                {t('contactForm.successInline')}
                            </motion.div>
                        )}
                        {submitState === 'error' && (
                            <motion.div variants={variants} className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {t('contactForm.errorInline')}
                            </motion.div>
                        )}

                        <motion.button
                            variants={variants}
                            type="submit"
                            disabled={isSubmitting}
                            className="group mt-1 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gunmetal w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="h-[1px] w-8 bg-gunmetal/30 group-hover:w-16 group-hover:bg-gunmetal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                            {isSubmitting ? t('contactForm.submitting') : t('contactForm.submit')}
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                        </motion.button>
                    </form>
                </section>
            </div>
        );
    }

    return (
        <>
            <motion.h3 variants={variants} className={titleClass}>
                {formTitle}
            </motion.h3>
            <motion.p variants={variants} className={subtitleClass}>
                {formSubtitle}
            </motion.p>

            {selectedWatch && (
                <motion.div variants={variants} className={selectedWatchClass}>
                    <div className={selectedWatchImageClass}>
                        <img src={selectedWatch.image} alt={selectedWatch.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-branding text-[10px] uppercase tracking-[0.3em] text-golden mb-2">
                            {t('contactForm.selectedTimepiece')}
                        </p>
                        <p className="text-sm font-medium text-gunmetal truncate">{selectedWatch.brand} {selectedWatch.name}</p>
                        <p className="text-xs text-stone-500 mt-1">
                            {selectedWatch.collection}
                            {selectedWatch.ref ? ` | Ref. ${selectedWatch.ref}` : ''}
                        </p>
                        {watchPrice && <p className="text-xs font-medium text-gunmetal mt-2">{watchPrice}</p>}
                    </div>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className={formClass}>
                <motion.div variants={variants} className={fieldGridClass}>
                    <div className="relative group">
                        <input
                            type="text"
                            id={`${idPrefix}-firstName`}
                            required
                            value={formData.first_name}
                            onChange={event => updateField('first_name', event.target.value)}
                            className={inputClass}
                            placeholder=" "
                        />
                        <label htmlFor={`${idPrefix}-firstName`} className={labelClass}>{t('contactForm.fields.firstName')} *</label>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            id={`${idPrefix}-lastName`}
                            required
                            value={formData.last_name}
                            onChange={event => updateField('last_name', event.target.value)}
                            className={inputClass}
                            placeholder=" "
                        />
                        <label htmlFor={`${idPrefix}-lastName`} className={labelClass}>{t('contactForm.fields.lastName')} *</label>
                    </div>
                </motion.div>

                <motion.div variants={variants} className={fieldGridClass}>
                    <div className="relative group">
                        <input
                            type="email"
                            id={`${idPrefix}-email`}
                            value={formData.email}
                            onChange={event => updateField('email', event.target.value)}
                            className={inputClass}
                            placeholder=" "
                        />
                        <label htmlFor={`${idPrefix}-email`} className={labelClass}>{t('contactForm.fields.email')}</label>
                    </div>
                    <div className="relative group">
                        <input
                            type="tel"
                            id={`${idPrefix}-phone`}
                            required
                            value={formData.phone}
                            onChange={event => updateField('phone', event.target.value)}
                            className={inputClass}
                            placeholder=" "
                        />
                        <label htmlFor={`${idPrefix}-phone`} className={labelClass}>{t('contactForm.fields.phone')} *</label>
                    </div>
                </motion.div>

                <motion.div variants={variants} className="relative group">
                    <select
                        id={`${idPrefix}-purpose`}
                        required
                        disabled={Boolean(lockedPurpose)}
                        value={lockedPurpose || formData.purpose}
                        onChange={event => updateField('purpose', event.target.value as ContactRequestPurpose | '')}
                        className="w-full bg-transparent border-b border-gunmetal/20 py-3 text-sm font-light text-stone-500 outline-none focus:border-gunmetal transition-colors appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-gunmetal"
                    >
                        <option value="" disabled>{t('contactForm.fields.selectSubject')}</option>
                        {Object.entries(purposeLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </motion.div>

                <motion.div variants={variants} className="relative group">
                    <textarea
                        id={`${idPrefix}-message`}
                        required
                        rows={isCompact ? 3 : 4}
                        value={formData.message}
                        onChange={event => updateField('message', event.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder=" "
                    />
                    <label htmlFor={`${idPrefix}-message`} className={labelClass}>{t('contactForm.fields.message')} *</label>
                </motion.div>

                {showInlineSuccess && submitState === 'success' && (
                    <motion.div variants={variants} className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                        <CheckCircle2 size={18} />
                        {t('contactForm.successInline')}
                    </motion.div>
                )}
                {submitState === 'error' && (
                    <motion.div variants={variants} className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {t('contactForm.errorInline')}
                    </motion.div>
                )}

                <motion.button
                    variants={variants}
                    type="submit"
                    disabled={isSubmitting}
                    className={submitClass}
                >
                    <span className="h-[1px] w-8 bg-gunmetal/30 group-hover:w-16 group-hover:bg-gunmetal transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                    {isSubmitting ? t('contactForm.submitting') : t('contactForm.submit')}
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                </motion.button>
            </form>
        </>
    );
};

export default ContactInquiryForm;
