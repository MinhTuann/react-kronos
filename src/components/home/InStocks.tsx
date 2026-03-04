import type { WatchItem } from "@/types"

const WatchItem = ({ watch }: { watch: WatchItem }) => {
    return (
        <div className="group cursor-pointer relative rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            {/* Image Container with subtle zoom and shift */}
            <div className="relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center p-12">
                <img
                    src={watch.image}
                    alt={watch.name}
                    className="w-[85%] h-auto object-contain transition-transform duration-[1.5s] cubic-bezier(0.2, 1, 0.3, 1) group-hover:scale-105"
                />
                {/* Subtle Overlay on Hover */}
                {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" /> */}
            </div>

            {/* Content Area */}
            <div className="flex flex-col items-center text-center pb-10 px-8 space-y-1">
                <span className="font-branding text-[8px] tracking-[0.3em] uppercase text-golden font-bold opacity-80 mb-2">
                    {watch.brand}
                </span>

                <h3 className="text-lg tracking-tight text-gunmetal italic">
                    <a href="#">
                        <span aria-hidden="true" className="absolute inset-0"></span>
                        {watch.collection}
                    </a>
                </h3>

                <div className="flex flex-col items-center">
                    <p className="text-[11px] uppercase tracking-widest text-bone">
                        {watch.name}
                    </p>
                    {/* Decorative divider that grows on hover */}
                    <div className="h-[1px] w-4 bg-golden mt-3 transition-all duration-500 group-hover:w-12" />
                </div>

                {/* Price or Detail - Hidden initially, slides up on hover */}
                <div className="overflow-hidden h-0 group-hover:h-6 transition-all duration-500 opacity-0 group-hover:opacity-100">
                    <p className="text-[12px] text-gunmetal font-semibold mt-2">
                        {watch.color}
                    </p>
                </div>
            </div>
        </div>
    )
}

const InStocks = ({ watches }: { watches: WatchItem[] }) => {
    return (
        <div className='bg-white'>
            <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8'>
                <div className='border-l border-golden pl-4 space-y-2 mb-6'>
                    <h2 className='font-branding text-lg tracking-widest uppercase text-golden'>In Stock</h2>
                    <p className='italic tracking-tight text-bone'>Discover our collection of watches in stock and ready to ship.</p>
                </div>
                <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
                    {watches.map((watch) => (
                        <WatchItem key={watch.id} watch={watch} />
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <button className="group relative inline-flex justify-center items-center pb-2 text-xs tracking-[0.4em] uppercase text-bone font-semibold transition-colors duration-500 hover:text-bone">
                        {/* The Button Text */}
                        <span>Find Your Watch</span>

                        {/* The Animated Underline */}
                        <span className="absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-bone transition-all duration-[600ms] ease-out group-hover:w-full group-hover:bg-bone" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InStocks;