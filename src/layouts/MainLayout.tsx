import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { useScroll } from "motion/react";

function MainLayout() {
    const { scrollY } = useScroll();

    return (
        <div className='bg-white text-black font-extralight'>
            <Header scrollY={scrollY} />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default MainLayout;