function BestBrand() {
    return (
        <section className="w-screen h-[70vh] overflow-hidden">
            <div className='relative w-full h-full flex'>
                <img alt="Best Seller Watch Close-up" className="absolute inset-0 object-cover opacity-80" src={`${import.meta.env.BASE_URL}patek_philippe_7140G001.jpeg`} />
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative px-32 grid grid-cols-2 gap-32">
                    <div className="order-2 md:order-1 flex flex-col justify-between py-24">
                        <span className="text-[11px] tracking-[0.4em] uppercase text-secondary font-semibold">Patek Philippe</span>
                        <div>
                            <h2 className="text-3xl text-white border-l-2 border-secondary pl-4">GRAND COMPLICATIONS</h2>
                            <h4 className="text-xl text-white pl-4">REF. 7140G-001</h4>
                        </div>
                        <p className="text-white/80">Patek Philippe pays tribute to women's increased interest in beautiful, complicated watches with a perpetual calendar associating technical refinement with aesthetic appeal. The famous ultra-thin self-winding Caliber 240 Q is housed in an elegant white gold case with diamond-set bezel. The silvery sunburst dial is adorned with applied numerals and minutes ‘pearls’ in white gold.</p>
                        <div className="pt-4">
                            <a className="inline-block px-10 py-4 bg-white text-primary text-[11px] tracking-widest uppercase font-bold hover:bg-slate-100 transition-all rounded-lg"
                                href="#">Explore the Icon</a>
                        </div>
                    </div>
                    <div className="order-1 md:order-2 flex flex-col justify-end py-24">
                        <div className="grid grid-cols-2 gap-8 ml-64">
                            <div className='order-1 space-y-4'>
                                <div className='justify-items-start'>
                                    <h1 className='text-secondary text-[11px] tracking-[0.4em] uppercase text-secondary font-semibold'>Size</h1>
                                    <p className='text-white text-[14px]'>35.1 mm</p>
                                </div>
                                <div className='justify-items-start'>
                                    <h1 className='text-secondary text-[11px] tracking-[0.4em] uppercase text-secondary font-semibold'>Material</h1>
                                    <p className='text-white text-[14px]'>Steel</p>
                                </div>
                            </div>
                            <div className='order-2 space-y-4'>
                                <div className='justify-items-start'>
                                    <h1 className='text-secondary text-[11px] tracking-[0.4em] uppercase text-secondary font-semibold'>Movement</h1>
                                    <p className='text-white text-[14px]'>Automatic</p>
                                </div>
                                <div className='justify-items-start'>
                                    <h1 className='text-secondary text-[11px] tracking-[0.4em] uppercase text-secondary font-semibold'>Strap</h1>
                                    <p className='text-white text-[14px]'>Steel bracelet, Leather strap</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BestBrand;