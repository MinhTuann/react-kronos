const NewsEvents = ({ news }: { news?: any[] }) => {
    // Fallback to existing mock data if no news provided
    const displayNews = (news && news.length > 0) ? news : [
        {
            category: "Exhibition",
            title: "The Art of Watches Grand Exhibition Tokyo 2023",
            description: "Discover the largest exhibition ever organized by Chronos & Co., bringing together more than 500 timepieces and objects.",
            image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfR7Gjpmk0eoE9zul2epqwGktp6ukyqyx97VdXda5ptjof2aqIO6mA-sd-KBHmG_TmHXx6hb5eSRw3Ey_Hjj7KPrB4R-yyivqAQ7JZHwm_wY3HEN9_-ZE8RVP-CWrh_kgOsdtA3J_ZPlZBwpLT8oO4ht3AEifbXvxevE1FwmS1vWVpHS555gPMaTc4rYox2plDRCXCz6wblNPbBfDjY08h6xNP7daeOaNpycSNz03QkuaZ7U8q-idxLGw4ARY4Oi-nj8QPArWIITZZ",
            link_url: "#"
        },
        {
            category: "Boutique",
            title: "New Opening in New York",
            description: "A new temple of watchmaking opens its doors on Fifth Avenue, featuring exclusive limited editions for the American market.",
            image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTIZhiiiaa15D4QmUIUNF21IysZIjE6uvalG8CmP_Cf4z7CCp4mPCvG7oLL9NbG3LARjGH7wtYoppbEhjJmz1Yvl3d6fROjvJP6G9tLt0Q9vdUH1rGeMMAoAeZh78Z9u1atwsyoum6B6jdR6D_uUDslWRWOI3qqACk0jhls1grMnAoelCBT7jCXoDl_TIjHC3e9b1w272V2s-eNk8EuW0KqVJs-yxZsI_zviF5aZvfXcRo5b268pELd-7AhONkezL3edapyiiEgOPb",
            link_url: "#"
        },
        {
            category: "Craftsmanship",
            title: "Rare Handcrafts 2023",
            description: "Showcasing the dexterity and core skills of the artisans who decorate our timepieces with enameling, engraving and gem-setting.",
            image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFI32ZIhvKWTsjbLJ4PCg__Ixbc9SSMLKaK8oezTFSx9y4NfIlGkYNtrDWvGma4ijtghdTyDpQ-OEm_o435GKENQNv_Z8zfqnn6zD-5ftFeEVgGHjmUuln9VBfRqIm31ltg93ULajBeA8Nx23z_rw3dO4MdsDXYU9l0q9Z_LK0Z_0vidqMxlYkv3uae5cfQd8YjrL5IN0ZkNiOHyW4unlFZcEss72rHvXEtCZ1CTG2eEBWe3ij0pcDSZeQL5EB_SVSdDiu6XY0Z3BY",
            link_url: "#"
        }
    ];

    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-6">
                    <div className='border-l border-golden pl-4 space-y-2'>
                        <h2 className='font-branding text-lg tracking-widest uppercase text-golden'>News &amp; Events</h2>
                        <p className='italic tracking-tight text-bone'>The world’s premium brands in one place</p>
                    </div>
                    <button className="group relative inline-flex justify-center items-center pb-2 text-[10px] tracking-[0.2em] uppercase text-bone font-semibold transition-colors duration-500 hover:text-bone">
                        {/* The Button Text */}
                        <span>View All News</span>

                        {/* The Animated Underline */}
                        <span className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-bone transition-all duration-[600ms] ease-out group-hover:w-full group-hover:bg-bone" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayNews.map((item, idx) => (
                        <div key={idx} className="group">
                            <div className="aspect-[4/3] overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800 rounded-lg">
                                <img alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={item.image_url} />
                            </div>
                            <p className="text-[9px] uppercase tracking-widest text-bone mb-3 font-semibold">{item.category}</p>
                            <h3 className="text-xl  mb-4 group-hover:text-gunmetal transition-colors">{item.title}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 line-clamp-3">{item.description}</p>
                            <a className="text-[10px] uppercase tracking-widest font-bold text-stormy flex items-center gap-2 group-hover:gap-4 transition-all"
                                href={item.link_url}>Read Article <span className="material-icons-outlined text-sm">east</span></a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default NewsEvents;