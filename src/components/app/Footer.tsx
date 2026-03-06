import { CONTACT_EMAIL, CONTACT_PHONE, YEAR_OF_FOUNDATION } from '@/utils';
import { Facebook, Instagram, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const paths: Record<string, string> = {
    'Our Story': '/about-us',
    'Contact Us': '/contact-us',
}

const getPath = (link: string) => paths[link] || '/collections';

// --- Reusable Navigation Column ---
const FooterNavGroup = ({ title, links }: { title: string, links: string[] }) => (
    <div className="flex flex-col">
        <h5 className="font-branding mb-8 text-[10px] uppercase tracking-[0.4em] text-gunmetal font-bold">
            {title}
        </h5>
        <ul className="flex flex-col gap-4 text-[13px] text-stone-500 font-light">
            {links.map((link, index) => (
                <li key={index}>
                    <Link className="hover:text-black transition-colors duration-300 flex items-center group w-fit" to={getPath(link)}>
                        {/* Luxury Detail: A tiny line that smoothly extends out on hover */}
                        <span className="h-[1px] w-0 bg-black mr-0 group-hover:w-4 group-hover:mr-3 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
                        {link}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const Footer = () => {
    return (
        <footer className="bg-white text-gunmetal pt-24 pb-12 border-t border-gunmetal/10">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">

                {/* --- Top Section: The Swiss Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-0 border-b border-gunmetal/10 pb-16 mb-16">

                    {/* Column 2: The Philosophy */}
                    <div className="order-2 md:order-1 flex flex-col lg:border-r lg:border-gunmetal/10 lg:pr-12">
                        <span className="font-branding text-[9px] uppercase tracking-[0.5em] text-gunmetal/40 font-bold mb-6 block flex items-center gap-4">
                            The Philosophy
                            <span className="h-[1px] w-4 bg-gunmetal/20"></span>
                        </span>
                        <p className="text-stone-500 text-[13px] font-light leading-[1.8]">
                            The pinnacle of horological artistry. Crafting timepieces that transcend generations through <span className="text-gunmetal italic">uncompromising precision</span> and aesthetic mastery. Every movement is a testament to our heritage.
                        </p>
                    </div>

                    {/* Column 1: The Mark & Origin (Now Centered) */}
                    <div className="order-1 md:order-2 flex flex-col items-center text-center justify-between lg:px-12">
                        <img
                            src={`${import.meta.env.BASE_URL}logo_black.png`}
                            alt='Kronos Logo'
                            className='h-16 md:h-20 w-auto mb-10 lg:mb-0'
                        />
                        <div className="mt-auto">
                            <span className="font-branding text-[10px] uppercase tracking-[0.4em] text-gunmetal font-bold block mb-2">
                                Kronos Luxury Timepieces
                            </span>
                            <span className="font-branding text-[10px] uppercase tracking-[0.4em] text-stone-400 block">
                                Ho Chi Minh City, VN — Est. {YEAR_OF_FOUNDATION}
                            </span>
                        </div>
                    </div>

                    {/* Column 3: The Promise */}
                    <div className="order-3 flex flex-col lg:border-l lg:border-gunmetal/10 lg:pl-12 items-start md:items-end">
                        <span className="font-branding text-[9px] uppercase tracking-[0.5em] text-gunmetal/40 font-bold mb-6 block flex items-center gap-4">
                            <span className="hidden md:block h-[1px] w-4 bg-gunmetal/20"></span>
                            The Promise
                            <span className="block md:hidden h-[1px] w-4 bg-gunmetal/20"></span>
                        </span>
                        <h3 className="font-serif italic text-xl text-left md:text-right lg:text-2xl text-gunmetal leading-relaxed">
                            "To possess a Kronos is to hold eternity in the palm of your hand."
                        </h3>
                    </div>

                </div>

                {/* --- Middle Section: Navigation Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8 mb-24">
                    {/* Social & Contact Column */}
                    <div className="flex flex-col">
                        <h5 className="font-branding mb-8 text-[10px] uppercase tracking-[0.4em] text-gunmetal font-bold">
                            Connect
                        </h5>
                        <div className="flex gap-8 mb-12">
                            <a href="#" className="text-stone-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <Facebook size={20} strokeWidth={1.2} />
                            </a>
                            <a href="#" className="text-stone-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <Instagram size={20} strokeWidth={1.2} />
                            </a>
                            <a href="#" className="text-stone-400 hover:text-black hover:-translate-y-1 transition-all duration-300">
                                <MapPin size={20} strokeWidth={1.2} />
                            </a>
                        </div>

                        <h5 className="font-branding mb-6 text-[10px] uppercase tracking-[0.4em] text-gunmetal font-bold">
                            Client Relations
                        </h5>
                        <a href={`tel:${CONTACT_PHONE}`} className="text-[13px] text-stone-500 font-light hover:text-black transition-colors mb-3 block w-fit">
                            {CONTACT_PHONE}
                        </a>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-[13px] text-stone-500 font-light hover:text-black transition-all duration-300 block border-b border-transparent hover:border-black w-fit pb-1">
                            {CONTACT_EMAIL}
                        </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8 mb-24">
                        <FooterNavGroup
                            title="The Brands"
                            links={['Richard Mille', 'Rolex', 'Hublot', 'Patek Philippe', 'Cartier', 'Audemars Piguet', 'Vacheron Constantin']}
                        />
                        <FooterNavGroup
                            title="The Company"
                            links={['Our Story', 'Contact Us']}
                        />
                    </div>
                    {/* <FooterNavGroup
                        title="Services"
                        links={['Owners', 'Instructions for Use', 'Service Centers', 'Extract from Archives', 'Contact Us', 'FAQ']}
                    /> */}
                </div>

                {/* --- Bottom Section: Legal Row --- */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-stone-400 font-medium gap-6">
                    <div>
                        © {new Date().getFullYear()} KRONOS. ALL RIGHTS RESERVED.
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <a className="hover:text-black transition-colors" href="#">Legal Notice</a>
                        <a className="hover:text-black transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-black transition-colors" href="#">Cookie Settings</a>
                        <a className="hover:text-black transition-colors" href="#">Accessibility</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;