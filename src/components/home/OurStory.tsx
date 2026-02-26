import React from 'react';

function OurStory() {
    return (
        <>
            <section className='bg-white max-h-screen h-screen'>
                <div className='mx-w-7xl h-full px-32 grid md:grid-cols-2 gap-16 items-center'>
                    <div className="order-2 md:order-1">
                        <div className='relative w-[420px] aspect-[2/3]'>
                            <img src='/DSC04304.jpg' className='absolute inset-0 w-full h-full object-cover rounded-2xl shadow-lg' />
                            <img src='/DSC04299.jpg' className='absolute -bottom-6 -right-6 w-[140px] aspect-[2/3] object-cover rounded-xl border-4 border-white shadow-xl' />
                        </div>
                    </div>
                    <div className="order-1 md:order-2 space-y-4">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl text-slate-900 leading-tight">The Kronos Story</h2>
                            <div className="w-20 h-1 bg-primary"></div>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed italic">
                            "Time is not merely measured; it is crafted with intent and preserved with honor."
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            For generations, our master watchmakers have dedicated their lives to the pursuit of horological perfection. Founded in the heart of the Swiss Jura mountains, Chronos began as a small atelier driven by a singular vision: to create timepieces that transcend the fleeting nature of trends.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Today, we blend centuries-old craftsmanship with modern innovation, ensuring every movement that leaves our workshop is a masterpiece of precision and a legacy for the future.
                        </p>
                        <button className="text-primary uppercase tracking-widest font-medium flex items-center gap-2 hover:gap-4 transition-all">
                            Discover Our Heritage <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </section>
            <section className="py-20 px-6 md:px-20 bg-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center space-y-4 group">
                            <div
                                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl font-extralight">target</span>
                            </div>
                            <h3 className="text-2xl font-light">Precision</h3>
                            <p className="text-slate-600 leading-relaxed">Accuracy down to the millisecond, achieved through
                                rigorous testing and impeccable movement calibration.</p>
                        </div>
                        <div className="text-center space-y-4 group">
                            <div
                                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl font-extralight">lightbulb</span>
                            </div>
                            <h3 className="text-2xl font-light">Innovation</h3>
                            <p className="text-slate-600 leading-relaxed">Constantly pushing the boundaries of what's
                                possible in horology while respecting the laws of traditional mechanics.</p>
                        </div>
                        <div className="text-center space-y-4 group">
                            <div
                                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <span className="material-symbols-outlined text-3xl font-extralight">hourglass</span>
                            </div>
                            <h3 className="text-2xl font-light">Timelessness</h3>
                            <p className="text-slate-600 leading-relaxed">Designs that transcend generations, maintaining
                                their aesthetic appeal and functional excellence for decades.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default OurStory;