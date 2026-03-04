function SecondBrand() {
    return (
        <section className="py-12 md:py-24 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 aspect-square overflow-hidden rounded-2xl">
                    <img alt="Watchmaker at work" className="w-full h-full object-cover"
                        src={`${import.meta.env.BASE_URL}richard_mile_rm4101.png`} />
                </div>
                <div className="order-1 md:order-2 space-y-8">
                    <div>
                        <p className="font-branding text-[11px] tracking-[0.3em] uppercase text-golden mb-4">Richard Mille</p>
                        <h2 className="text-5xl mb-6">CALIBRE <br /> RM41-01</h2>
                        <p className="text-gunmetal leading-relaxed max-w-md">Richard Mille’s relationship with the world of soccer started with the RM 11-01 and the RM 11-04 Roberto Mancini, which introduced an innovative match-time display. Taking this daring concept even further, the new RM 41-01 Tourbillon Soccer tackles a unique challenge: fully tracking a match through the prism of Haute Horlogerie: from kick-off to the final whistle, taking note of every goal.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-bone/30 pt-8">
                        <div>
                            <p className="font-branding text-[9px] uppercase tracking-widest text-bone mb-1">Size</p>
                            <p>41 mm</p>
                        </div>
                        <div>
                            <p className="font-branding text-[9px] uppercase tracking-widest text-bone mb-1">Material</p>
                            <p>White Gold</p>
                        </div>
                        <div>
                            <p className="font-branding text-[9px] uppercase tracking-widest text-bone mb-1">Movement</p>
                            <p>Manual</p>
                        </div>
                        <div>
                            <p className="font-branding text-[9px] uppercase tracking-widest text-bone mb-1">Strap</p>
                            <p>Alligator</p>
                        </div>
                    </div>
                    <a className="inline-block px-6 py-3 font-branding bg-stormy text-white text-[11px] tracking-widest uppercase hover:bg-opacity-90 transition-all rounded-lg"
                        href="#">Discover the Model</a>
                </div>
            </div>
        </section>
    );
}

export default SecondBrand;