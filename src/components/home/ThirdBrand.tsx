import React from 'react';

function ThirdBrand() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-slate-400 mb-4">Rolex</p>
                        <h2 className="text-5xl font-display mb-6">1908 <br /> REF. M52508-0008</h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">Elegant, classic and decidedly contemporary, the Perpetual 1908 immortalizes Rolex’s age-long daring spirit. Heir to the brand’s aesthetic heritage as much as to its numerous innovations in watchmaking, the watch perpetuates the brand’s pursuit of excellence. This fine example of Rolex’s watchmaking prowess, with Superlative Chronometer certification, brings classicism to the future.</p>
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
                <div className="bg-slate-100 dark:bg-slate-900 aspect-square overflow-hidden rounded-2xl">
                    <img alt="Watchmaker at work" className="w-full h-full object-cover"
                        src="/rolex-m525080008.png" />
                </div>
            </div>
        </section>
    );
}

export default ThirdBrand;