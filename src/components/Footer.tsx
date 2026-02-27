import IconButton from './IconButton'
import { Facebook, Instagram, MapPin } from 'lucide-react'

function Footer() {
    return (
        <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-1 lg:col-span-2 pr-0 lg:pr-12 flex items-center justify-center">
                        <div className="flex items-center gap-2 mb-6 mr-6">
                            <img src={`${import.meta.env.BASE_URL}logo_white.png`} alt='logo' className='h-24' />
                        </div>
                        <div className="flex gap-4">
                            <IconButton icon={<Facebook strokeWidth={1} />} label={'Facebook'} className='text-white rounded-full border border-white/10' />
                            <IconButton icon={<Instagram strokeWidth={1} />} label={'Instagram'} className='text-white rounded-full border border-white/10' />
                            <IconButton icon={<MapPin strokeWidth={1} />} label={'Location'} className='text-white rounded-full border border-white/10' />
                        </div>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-secondary">Collections</h5>
                        <ul className="flex flex-col gap-4 text-sm text-gray-400 font-light">
                            <li><a className="hover:text-white transition-colors" href="#">Grand Complications</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Complications</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Calatrava</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Gondolo</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Golden Ellipse</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Nautilus</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Aquanaut</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-secondary">The Company</h5>
                        <ul className="flex flex-col gap-4 text-sm text-gray-400 font-light">
                            <li><a className="hover:text-white transition-colors" href="#">Savoir-Faire</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">The Manufacture</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Library</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Museum</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Press Room</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-xs uppercase tracking-[0.2em] text-secondary">Services</h5>
                        <ul className="flex flex-col gap-4 text-sm text-gray-400 font-light">
                            <li><a className="hover:text-white transition-colors" href="#">Owners</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Instructions for Use</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Service Centers</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Extract from Archives</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">Contact Us</a></li>
                            <li><a className="hover:text-white transition-colors" href="#">FAQ</a></li>
                        </ul>
                    </div>
                </div>
                <div
                    className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
                    <div className="mb-4 md:mb-0">
                        © 2023 Kronos. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a className="hover:text-white transition-colors" href="#">Legal Notice</a>
                        <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
                        <a className="hover:text-white transition-colors" href="#">Cookie Settings</a>
                        <a className="hover:text-white transition-colors" href="#">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;