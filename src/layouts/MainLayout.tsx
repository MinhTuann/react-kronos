import { Outlet } from 'react-router-dom';
import { useScroll } from 'motion/react';
import { Footer, Header } from '@/components';

const MainLayout = () => {
    const { scrollY } = useScroll();

    return (
        <div className='font-serif bg-white text-black font-thin antialiased'>
            <Header scrollY={scrollY} />
            <main className='min-h-screen'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;