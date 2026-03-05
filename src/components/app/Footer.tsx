import IconButton from './IconButton'
import { Facebook, Instagram, MapPin } from 'lucide-react'

const FooterNavGroup = ({ title, links }: { title: string, links: string[] }) => (
    <div className="text-center lg:text-left">
        <h5 className="font-branding mb-6 text-[11px] uppercase tracking-[0.3em] text-vanilla">
            {title}
        </h5>
        <ul className="flex flex-col gap-3 text-sm text-gray-400 font-light">
            {links.map((link, index) => (
                <li key={index}>
                    <a className="hover:text-white transition-colors duration-300" href="#">
                        {link}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const Footer = () => {
    return (
        <footer className="bg-black text-white py-16 border-t border-white/10">
            <div className="max-[1440px] mx-auto px-6 sm:px-8 lg:px-12">

                {/* Grid Layout Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-12 gap-x-8 mb-16 lg:mb-24">

                    {/* Brand & Social Column */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col items-center lg:items-start lg:pr-12 text-center lg:text-left">
                        <div className="mb-6">
                            <img
                                src={`${import.meta.env.BASE_URL}logo_white.png`}
                                alt='Kronos Logo'
                                className='h-20 w-auto opacity-90'
                            />
                        </div>
                        <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm mb-8">
                            The pinnacle of horological artistry. Crafting timepieces that transcend generations through precision and aesthetic mastery.
                        </p>
                        <div className="flex gap-4">
                            <IconButton
                                icon={<Facebook size={18} strokeWidth={1} />}
                                label='Facebook'
                                className='text-white rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-colors'
                            />
                            <IconButton
                                icon={<Instagram size={18} strokeWidth={1} />}
                                label='Instagram'
                                className='text-white rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-colors'
                            />
                            <IconButton
                                icon={<MapPin size={18} strokeWidth={1} />}
                                label='Location'
                                className='text-white rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-colors'
                            />
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <FooterNavGroup
                        title="Collections"
                        links={['Grand Complications', 'Complications', 'Calatrava', 'Gondolo', 'Golden Ellipse', 'Nautilus', 'Aquanaut']}
                    />
                    <FooterNavGroup
                        title="The Company"
                        links={['Savoir-Faire', 'The Manufacture', 'Library', 'Museum', 'Press Room', 'Careers']}
                    />
                    <FooterNavGroup
                        title="Services"
                        links={['Owners', 'Instructions for Use', 'Service Centers', 'Extract from Archives', 'Contact Us', 'FAQ']}
                    />
                </div>

                {/* Footer Legal Row */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light gap-6">
                    <div>
                        © 2026 Kronos. All rights reserved.
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <a className="hover:text-white transition-colors uppercase tracking-wider" href="#">Legal Notice</a>
                        <a className="hover:text-white transition-colors uppercase tracking-wider" href="#">Privacy Policy</a>
                        <a className="hover:text-white transition-colors uppercase tracking-wider" href="#">Cookie Settings</a>
                        <a className="hover:text-white transition-colors uppercase tracking-wider" href="#">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;