import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, type PanInfo } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { VideoSlide } from '@/types';
import { Skeleton, TextSkeleton } from '../common/Skeleton';

interface Props {
  videos?: VideoSlide[];
  isLoading?: boolean;
}

// --- 1. The Parent Container Variants ---
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    zIndex: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    zIndex: 0,
  })
};

// --- 2. The Child Parallax Variants ---
const videoVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '-20%' : '20%',
    scale: 1.15,
  }),
  center: {
    x: 0,
    scale: 1.15,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '-20%' : '20%',
    scale: 1.15,
  })
};

const ParallaxVideo = ({ url, poster, direction, isPlaying }: { url: string; poster?: string; direction: number; isPlaying: boolean }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setIsPosterLoaded(false);
  }, [url]);

  useEffect(() => {
    const handlePlayback = async () => {
      if (localVideoRef.current) {
        try {
          if (isPlaying) {
            await localVideoRef.current.play();
          } else {
            localVideoRef.current.pause();
          }
        } catch (error) {
          // Playback might be interrupted
        }
      }
    };
    handlePlayback();
  }, [isPlaying, url]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {!isLoaded && !isPosterLoaded && (
        <div className="absolute inset-0 w-full h-full z-20">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      )}
      <motion.div
        custom={direction}
        variants={videoVariants}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 w-full h-full scale-[1.15]"
      >
        <AnimatePresence>
          {poster && !isLoaded && (
            <motion.img
              key="poster"
              src={poster}
              onLoad={() => setIsPosterLoaded(true)}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover z-10"
            />
          )}
        </AnimatePresence>
        <video
          ref={localVideoRef}
          src={url}
          poster={poster}
          onLoadedData={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          muted
          loop
          playsInline
        />
      </motion.div>
    </div>
  );
};

const VideoCarousel = ({ videos = [], isLoading = false }: Props) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  if (isLoading) {
    return (
      <div className="relative w-full h-[100dvh] overflow-hidden bg-black flex items-center justify-center">
        <Skeleton className="absolute inset-0 w-full h-full rounded-none opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        
        <div className="absolute bottom-0 left-0 w-full p-[10dvh] z-20 space-y-6">
          <div className="space-y-4">
            <Skeleton width={350} height={48} className="rounded-lg opacity-50" />
            <Skeleton width={250} height={48} className="rounded-lg opacity-30" />
          </div>
          <TextSkeleton lines={2} className="max-w-xl opacity-20" />
          <Skeleton width={140} height={44} className="rounded-lg opacity-40" />
        </div>
      </div>
    );
  }

  const index = Math.max(0, Math.min(page, videos.length - 1));
  const video = videos[index];

  const paginate = (newDirection: number) => {
    const newIndex = page + newDirection;
    if (newIndex >= 0 && newIndex < videos.length) {
      setPage([newIndex, newDirection]);
      setIsPlaying(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    mouseX.set(x);
    mouseY.set(e.clientY - rect.top);
    const isLeft = x < (rect.width / 2);
    if ((isLeft && index === 0) || (!isLeft && index === videos.length - 1)) {
      setHoverSide(null);
    } else {
      setHoverSide(isLeft ? 'left' : 'right');
    }
  };

  const handleClick = () => {
    if (hoverSide === 'left') paginate(-1);
    else if (hoverSide === 'right') paginate(1);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;
  const handleDragEnd = (_e: any, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  return (
    <div
      className='relative w-full h-[100dvh] overflow-hidden bg-black cursor-none group flex items-center justify-center'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverSide(null)}
      onClick={handleClick}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          className='absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden'
        >
          <ParallaxVideo 
            url={video.url} 
            poster={video.thumbnail_url}
            direction={direction} 
            isPlaying={isPlaying} 
          />

          <div className='absolute w-full bottom-0 left-0 p-[10dvh] bg-gradient-to-t from-black/80 to-transparent pointer-events-none'>
            <div
              className='w-fit opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-auto'
              onMouseEnter={() => setHoverSide(null)}
              onMouseMove={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {((currentLang === 'en' && video.title_en) ? video.title_en : video.title).split('\\n').map(
                (title, idx) => 
                  <h1 className={`font-branding text-2xl md:text-4xl ${idx === 0 ? 'text-white' : 'text-vanilla'}`} key={`video-${idx}-title`}>
                    {title}
                  </h1>
              )}
              <p className='italic text-sm text-white my-4 md:my-6 max-w-md border-l border-white pl-2 md:pl-4'>
                {(currentLang === 'en' && video.description_en) ? video.description_en : video.description}
              </p>
              <button
                className='font-branding bg-stormy hover:bg-opacity-90 text-[10px] md:text-[11px] text-white uppercase tracking-widest font-medium px-6 py-3 rounded-lg'
              >
                {t('common.exploreMore')}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode='wait'>
        {hoverSide && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
            className='absolute top-0 left-0 z-50 pointer-events-none hidden md:flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white shadow-2xl border border-white/30'
          >
            <motion.div
              key={hoverSide}
              initial={{ x: hoverSide === 'left' ? 10 : -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {hoverSide === 'left' ? <ChevronLeft size={24} strokeWidth={1} /> : <ChevronRight size={24} strokeWidth={1} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none z-10'>
        {videos.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>

      <div
        className='absolute bottom-4 right-4 pointer-events-auto cursor-auto z-10'
        onMouseEnter={() => setHoverSide(null)}
        onMouseMove={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsPlaying(!isPlaying)
          }}
          className='p-4 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-md text-white'
        >
          {isPlaying ? <Pause size={24} strokeWidth={1} /> : <Play size={24} strokeWidth={1} />}
        </button>
      </div>
    </div>
  );
};

export default VideoCarousel;