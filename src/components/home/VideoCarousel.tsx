import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import type { VideoSlide } from '@/types';

interface Props {
  videos: VideoSlide[];
}

const VideoCarousel = ({ videos }: Props) => {
  const [index, setIndex] = useState(0);

  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Motion values for smooth cursor tracking without re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement slightly with a spring
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  /* 
    Updated Logic:
    1. If currently on the **first** slide (index 0), hovering on the left side should NOT show the "Previous" cursor.
    2. If currently on the **last** slide, hovering on the right side should NOT show the "Next" cursor.
  */

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 1. Update coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    mouseX.set(x); // Relative to container
    mouseY.set(e.clientY - rect.top);

    // 2. Determine side (Left vs Right)
    const isLeft = x < (rect.width / 2);

    // 3. Conditional Hover State (Boundary check)
    if ((isLeft && index === 0) || (!isLeft && index === videos.length - 1)) {
      setHoverSide(null);
    } else {
      setHoverSide(isLeft ? 'left' : 'right');
    }
  };

  const handleClick = () => {
    // Only navigate if a valid direction is active
    if (hoverSide === 'left') {
      setIndex((prev) => prev - 1);
    } else if (hoverSide === 'right') {
      setIndex((prev) => prev + 1);
    }
    setIsPlaying(true);
  };

  // Reset hover state when the index changes (e.g., just navigated to the first slide)
  // causing the cursor to potentially disappear if interactions shouldn't be allowed.
  useEffect(() => {
    if (index === 0 && hoverSide === 'left') setHoverSide(null);
    if (index === videos.length - 1 && hoverSide === 'right') setHoverSide(null);
  }, [index, hoverSide]);

  // Auto-play/pause logic when index changes
  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [index, isPlaying]);

  const video = useMemo(() => videos[index], [index, videos]);

  return (
    <div
      className='relative w-full h-[100dvh] overflow-hidden bg-black cursor-none group flex items-center justify-center'
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverSide(null)}
      onClick={handleClick}>
      {/* 1. The Video Layer */}
      <AnimatePresence mode='wait'>
        <motion.video
          key={index}
          ref={videoRef}
          src={video.url}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          /* - playsInline is required for autoPlay on iOS 
             - object-cover ensures no black bars on tall mobile screens
          */
          className='absolute inset-0 w-full h-full object-cover pointer-events-none'
          autoPlay
          muted
          loop
          playsInline
        />
      </AnimatePresence>

      {/* 2. The Custom Following Cursor */}
      <AnimatePresence mode='wait'>
        {hoverSide && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            style={{ 
              x: cursorX, 
              y: cursorY,
              translateX: '-50%', // Center the cursor on the mouse tip
              translateY: '-50%'
            }}
            className='absolute top-0 left-0 z-50 pointer-events-none flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full text-white shadow-2xl border border-white/30'
          >
            {/* Swap Icon based on side */}
            <motion.div
              key={hoverSide} // Animate the icon switch
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

      {/* 3. Video Content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className='absolute inset-0 w-full h-full pointer-events-none'
        >
          {/* Title */}
          <div className='absolute w-full bottom-0 left-0 p-[10dvh] bg-gradient-to-t from-black/80 to-transparent'>
            <div
              className='w-fit opacity-60 hover:opacity-100 transition-opacity pointer-events-auto cursor-auto'
              onMouseEnter={() => setHoverSide(null)}
              onMouseMove={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {video.title.split('\n').map(
                (title, index) => 
                  <h1 className={`text-4xl md:text-6xl ${index === 0 ? 'text-white' : 'text-secondary'}`} key={`video-${index}-title`}>
                    {title}
                  </h1>
              )}
              <h3 className='text-white my-4 md:my-6 max-w-md border-l border-white pl-2 md:pl-4'>{video.description}</h3>
              <button
                className='bg-primary text-[10px] md:text-[11px] text-white uppercase tracking-widest font-medium px-6 py-3 rounded-lg'
                onClick={(e) => {
                  e.preventDefault();
                  console.log('press');
                }}>
                Discover More
              </button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto cursor-auto'>
            {videos.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <div
            className='absolute bottom-4 right-4 pointer-events-auto cursor-auto'
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default VideoCarousel;