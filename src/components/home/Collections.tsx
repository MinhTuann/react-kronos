function Collections() {
    return (
        <section className="py-24 bg-background-light dark:bg-background-dark">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <p className="text-[11px] tracking-[0.3em] uppercase text-slate-400 mb-2">Discover The World</p>
                        <h2 className="text-4xl font-display">Timepiece Brands</h2>
                    </div>
                    <a className="text-[10px] tracking-[0.2em] uppercase font-bold border-b border-primary pb-1" href="#">View
                        All Collections</a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="group cursor-pointer relative overflow-hidden aspect-[3/4]">
                        <img alt="Patek Philippe watch"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            src={`${import.meta.env.BASE_URL}patek_philippe.png`} />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                            <h3
                                className="text-2xl font-display text-white mb-2 underline underline-offset-8 decoration-accent/50">
                                Patek Philippe</h3>
                        </div>
                    </div>
                    <div
                        className="group cursor-pointer relative overflow-hidden aspect-[3/4] md:translate-y-12">
                        <img alt="Rolex watch"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            src={`${import.meta.env.BASE_URL}rolex.png`} />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                            <h3
                                className="text-2xl font-display text-white mb-2 underline underline-offset-8 decoration-accent/50">
                                Calatrava</h3>
                        </div>
                    </div>
                    <div className="group cursor-pointer relative overflow-hidden aspect-[3/4]">
                        <img alt="Hublot watch"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            src={`${import.meta.env.BASE_URL}hublot.png`} />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                            <h3
                                className="text-2xl font-display text-white mb-2 underline underline-offset-8 decoration-accent/50">
                                Hublot</h3>
                        </div>
                    </div>
                    <div className="group cursor-pointer relative overflow-hidden aspect-[3/4] md:translate-y-12">
                        <img alt="Cartier watch"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            src={`${import.meta.env.BASE_URL}cartier.png`} />
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-10 flex flex-col justify-end">
                            <h3
                                className="text-2xl font-display text-white mb-2 underline underline-offset-8 decoration-accent/50">
                                Cartier</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Collections;