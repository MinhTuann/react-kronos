const SpecItem = ({ label, value }: { label: string; value: string }) => (
    <div className='flex flex-col space-y-1 md:items-end'>
        <h1 className='text-secondary text-[10px] tracking-[0.3em] uppercase font-bold'>{label}</h1>
        <p className='text-white text-[15px] font-light md:text-right'>{value}</p>
    </div>
);

function BestBrand() {
    return (
        <section className='w-full min-h-[600px] md:h-auto md:aspect-[16/6] overflow-hidden relative'>
            {/* Background remains absolute */}
            <img
                alt='Best Seller Watch Close-up'
                className='absolute inset-0 w-full h-full object-cover opacity-80'
                src={`${import.meta.env.BASE_URL}patek_philippe_7140G001.jpeg`}
            />
            <div className='absolute inset-0 bg-black/70'></div>

            {/* Content Container */}
            <div className='relative z-10 w-full h-full px-8 py-16 md:px-32 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32'>

                {/* Left Column: Branding & Main CTA */}
                <div className='flex flex-col space-y-8 md:justify-between h-full'>
                    <span className='text-[11px] tracking-[0.4em] uppercase text-secondary font-semibold'>Patek Philippe</span>

                    <div className='space-y-2'>
                        <h2 className='text-3xl md:text-4xl text-white border-l-2 border-secondary pl-4 leading-tight'>GRAND COMPLICATIONS</h2>
                        <h4 className='text-lg md:text-xl text-white/70 pl-4 italic'>REF. 7140G-001</h4>
                    </div>

                    <p className='text-white/80 leading-relaxed max-w-lg'>
                        Patek Philippe pays tribute to women's increased interest in beautiful, complicated watches with a perpetual calendar associating technical refinement...
                    </p>

                    <div>
                        <a className='inline-block w-full md:w-auto text-center px-10 py-4 bg-white text-primary text-[11px] tracking-widest uppercase font-bold hover:bg-slate-100 transition-all rounded-lg'
                            href='#'>Explore the Icon</a>
                    </div>
                </div>

                {/* Right Column: Specifications */}
                <div className='flex flex-col justify-end md:items-end'>
                    {/* Removed ml-64 (which breaks mobile) and used a clean 2x2 grid */}
                    <div className='grid grid-cols-2 gap-x-4 gap-y-8 md:ml-0 lg:ml-32'>
                        <SpecItem label='Size' value='35.1 mm' />
                        <SpecItem label='Material' value='White Gold' />
                        <SpecItem label='Movement' value='Automatic (240 Q)' />
                        <SpecItem label='Strap' value='Alligator Leather' />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BestBrand;