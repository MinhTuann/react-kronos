import { Outlet } from 'react-router-dom';
import { useScroll } from 'motion/react';
import { Footer, Header } from '@/components/app';
import ScrollToTop from '@/components/common/ScrollToTop';

const MainLayout = () => {
    const { scrollY } = useScroll();

    return (
        <div className='font-serif bg-white text-black font-thin antialiased'>
            <ScrollToTop />
            <Header scrollY={scrollY} />
            <main className='min-h-screen'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;
