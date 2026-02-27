import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import IconButton from './IconButton'
import { MenuIcon, WatchIcon, SearchIcon } from 'lucide-react'
import { useMotionValueEvent, MotionValue } from 'motion/react'

interface Props {
    scrollY: MotionValue<number>;
}

function Header({ scrollY }: Props) {
    const viewRef = useRef<HTMLDivElement>(null);
    const [isScrolledOutOfVideo, setIsScrolledOutOfVideo] = useState(false);

    useMotionValueEvent(scrollY, 'change', (current) => {
        setIsScrolledOutOfVideo(current > window.innerHeight - (viewRef.current?.offsetHeight || 0))
    })

    return (
        <header
            ref={viewRef}
            className={`fixed top-0 z-50 w-[100dvw] transition-colors duration-300 ${isScrolledOutOfVideo ? 'bg-white' : 'bg-transparent'} items-center`}>
            <div className='mx-auto px-6 grid grid-cols-3 items-center justify-between'>
                <div className='flex justify-start'>
                    <IconButton icon={<MenuIcon strokeWidth={1} />} label={'Menu'} className={isScrolledOutOfVideo ? 'text-black' : 'text-white'} />
                </div>
                <div className='flex justify-center'>
                    <Link to="/" className='flex items-center'>
                        <img src={`${import.meta.env.BASE_URL}logo_${isScrolledOutOfVideo ? 'black' : 'white'}.png`} alt="logo" className='h-16 md:h-18' />
                    </Link>
                </div>
                <div className='flex justify-end'>
                    <nav className='flex gap-6'>
                        <IconButton icon={<WatchIcon strokeWidth={1} />} label={'Products'} className={isScrolledOutOfVideo ? 'text-black' : 'text-white'} />
                        <IconButton icon={<SearchIcon strokeWidth={1} />} label={'Search'} className={isScrolledOutOfVideo ? 'text-black' : 'text-white'} />
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header;
