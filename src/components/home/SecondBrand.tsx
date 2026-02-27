function SecondBrand() {
    return (
        <section className="py-12 md:py-24 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="bg-slate-100 dark:bg-slate-900 aspect-square overflow-hidden rounded-2xl">
                    <img alt="Watchmaker at work" className="w-full h-full object-cover"
                        src={`${import.meta.env.BASE_URL}richard_mile_rm4101.png`} />
                </div>
                <div className="space-y-8">
                    <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-slate-400 mb-4">Richard Mille</p>
                        <h2 className="text-5xl font-display mb-6">CALIBRE <br /> RM41-01</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">Richard Mille’s relationship with the world of soccer started with the RM 11-01 and the RM 11-04 Roberto Mancini, which introduced an innovative match-time display. Taking this daring concept even further, the new RM 41-01 Tourbillon Soccer tackles a unique challenge: fully tracking a match through the prism of Haute Horlogerie: from kick-off to the final whistle, taking note of every goal.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-slate-100 dark:border-slate-800 pt-8">
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Size</p>
                            <p className="font-medium">41 mm</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Material</p>
                            <p className="font-medium">White Gold</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Movement</p>
                            <p className="font-medium">Manual</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Strap</p>
                            <p className="font-medium">Alligator</p>
                        </div>
                    </div>
                    <a className="inline-block px-8 py-4 bg-primary text-white text-[11px] tracking-widest uppercase font-semibold hover:bg-opacity-90 transition-all rounded-lg"
                        href="#">Discover the Model</a>
                </div>
            </div>
        </section>
    );
}

export default SecondBrand;