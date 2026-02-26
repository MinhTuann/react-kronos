const services = [
    { title: 'Free Shipping', description: 'Free Shipping on all orders' },
    { title: 'Free Returns', description: '7 days return guarantee' },
    { title: 'Support 24/7', description: 'Online Support anytime' },
    { title: 'Secure Payment', description: '100% secure payment' },
]

function Services() {
    return (
        <section>
            <div className='mx-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center'>
                <div>
                    <h4 className='text-tertiary'>Services</h4>
                    <h1 className='text-4xl md:text-5xl leading-tight text-tertiary'>
                        Premium Watches <br /> For Every Moment
                    </h1>
                    <p className='mt-5 text-xl'>
                        Discover our collection of high-quality watches, crafted with precision and style.
                    </p>
                    <button className='mt-8 bg-tertiary text-primary px-6 py-3 rounded-lg hover:bg-orange-500'>
                        Discover More
                    </button>
                </div>
                <img src="/kronos.jpg" alt="kronos" className='rounded-2xl' />
            </div>
        </section>
    );
}