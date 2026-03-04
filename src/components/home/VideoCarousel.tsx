import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, type PanInfo } from 'motion/react';
import type { VideoSlide } from '@/types';

interface Props {
  videos: VideoSlide[];
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
    // If the container enters from the right, the video starts pushed 20% to the left
    x: direction > 0 ? '-20%' : '20%',
    scale: 1.15, // Scale up slightly so we don't see black edges when it shifts
  }),
  center: {
    x: 0,
    scale: 1.15,
  },
  exit: (direction: number) => ({
    // If the container exits to the left, the video pans 20% to the right
    x: direction < 0 ? '-20%' : '20%',
    scale: 1.15,
  })
};

// --- 3. The Isolated Video Component (Fixes the Ref bug) ---
const ParallaxVideo = ({ url, direction, isPlaying }: { url: string; direction: number; isPlaying: boolean }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);

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
          console.log("Video playback interrupted.");
        }
      }
    };
    handlePlayback();
  }, [isPlaying, url]);

  return (
    <motion.video
      custom={direction}
      variants={videoVariants}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      ref={localVideoRef}
      src={url}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      muted
      loop
      playsInline
    />
  );
};

const VideoCarousel = ({ videos }: Props) => {
  // We now track the index AND the direction we are moving
  const [[page, direction], setPage] = useState([0, 0]);
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Safely wrap the index so it doesn't break if it goes out of bounds
  // (Though our boundaries prevent this, it's a good safety net)
  const index = Math.max(0, Math.min(page, videos.length - 1));

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  // Helper to change pages and set the direction simultaneously
  const paginate = (newDirection: number) => {
    const newIndex = page + newDirection;
    // Boundary check
    if (newIndex >= 0 && newIndex < videos.length) {
      setPage([newIndex, newDirection]);
      setIsPlaying(true);
    }
  };

  // --- 1. Mouse Tracking Logic (Desktop) ---
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
    if (hoverSide === 'left') {
      paginate(-1); // Move Left
    } else if (hoverSide === 'right') {
      paginate(1);  // Move Right
    }
  };

  // --- 2. Swipe Logic (Mobile) ---
  // Minimum distance or velocity required to trigger a slide change
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);

    // Swiped Left (Next Slide)
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } 
    // Swiped Right (Previous Slide)
    else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  // Reset states
  useEffect(() => {
    if (index === 0 && hoverSide === 'left') setHoverSide(null);
    if (index === videos.length - 1 && hoverSide === 'right') setHoverSide(null);
  }, [index, hoverSide, videos.length]);

  const video = useMemo(() => videos[index], [index, videos]);

  return (
    <div
      className='relative w-full h-[100dvh] overflow-hidden bg-black cursor-none group flex items-center justify-center'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverSide(null)}
      onClick={handleClick}
    >
      {/* We use initial={false} so the very first video doesn't slide in on page load.
        We pass 'direction' into custom so the variants know which way to slide.
      */}
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
          {/* REPLACE the old <motion.video> block with our new isolated component */}
          <ParallaxVideo 
            url={video.url} 
            direction={direction} 
            isPlaying={isPlaying} 
          />

          {/* Title Area */}
          <div className='absolute w-full bottom-0 left-0 p-[10dvh] bg-gradient-to-t from-black/80 to-transparent pointer-events-none'>
            <div
              className='w-fit opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-auto'
              onMouseEnter={() => setHoverSide(null)}
              onMouseMove={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {video.title.split('\n').map(
                (title, idx) => 
                  <h1 className={`font-branding text-2xl md:text-4xl ${idx === 0 ? 'text-white' : 'text-vanilla'}`} key={`video-${idx}-title`}>
                    {title}
                  </h1>
              )}
              <p className='italic text-sm text-white my-4 md:my-6 max-w-md border-l border-white pl-2 md:pl-4'>{video.description}</p>
              <button
                className='font-branding bg-stormy hover:bg-opacity-90 text-[10px] md:text-[11px] text-white uppercase tracking-widest font-medium px-6 py-3 rounded-lg'
                onClick={(e) => { e.preventDefault(); console.log('press'); }}
              >
                Discover More
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 3. The Custom Following Cursor (Desktop Only) */}
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

      {/* 4. Global UI Controls (These sit above the sliding videos so they don't move) */}
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