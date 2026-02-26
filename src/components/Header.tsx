import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IconButton from './IconButton';
import { MenuIcon, WatchIcon, SearchIcon } from 'lucide-react';
import { useMotionValueEvent, MotionValue } from 'motion/react';

interface Props {
    scrollY: MotionValue<number>;
}

function Header({ scrollY }: Props) {
    const [scrollDirection, setScrollDirection] = useState("down");
    const [isScrolledOutOfVideo, setIsScrolledOutOfVideo] = useState(false);

    useMotionValueEvent(scrollY, "change", (current) => {
        const diff = current - (scrollY.getPrevious() ?? 0)
        setScrollDirection(diff > 0 ? "down" : "up")
        setIsScrolledOutOfVideo(current > window.innerHeight)
    })

    return (
        <header className={`fixed w-full ${isScrolledOutOfVideo ? 'bg-white' : 'bg-transparent'}`}>
            <div className="mx-auto px-6 h-16 flex items-center justify-between">
                {/* text */}
                <IconButton icon={<MenuIcon strokeWidth={1} />} label={'Menu'} className={isScrolledOutOfVideo ? 'text-black' : 'text-white'} />
                {/* logo */}
                <Link to="/" className='flex items-center gap-2'>
                    <img src={`/logo_${isScrolledOutOfVideo ? 'black' : 'white'}.png`} alt="logo" className='h-32' />
                </Link>
                {/* menu */}
                <nav className='flex gap-6'>
                    <IconButton icon={<WatchIcon strokeWidth={1} />} label={'Products'} className={isScrolledOutOfVideo ? 'text-black' : 'text-white'} />
                    <IconButton icon={<SearchIcon strokeWidth={1} />} label={'Search'} className={isScrolledOutOfVideo ? 'text-black' : 'text-white'} />
                </nav>
            </div>
        </header>
    )
}

export default Header;
