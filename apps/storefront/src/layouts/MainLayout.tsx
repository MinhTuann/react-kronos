import { Outlet } from 'react-router-dom';
import { useScroll } from 'motion/react';
import { Footer, Header, ScrollToTop } from '@/components';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const MainLayout = () => {
    const { scrollY } = useScroll();
    const { i18n } = useTranslation();

    useEffect(() => {
        const updateLang = () => {
            const currentLang = i18n.language || 'vi';
            document.documentElement.setAttribute('lang', currentLang.split('-')[0]);
        };
        updateLang();
        i18n.on('languageChanged', updateLang);
        return () => {
            i18n.off('languageChanged', updateLang);
        };
    }, [i18n]);

    return (
        <div className="font-serif bg-white text-black font-thin antialiased">
            <ScrollToTop />
            <Header scrollY={scrollY} />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}


export default MainLayout;
