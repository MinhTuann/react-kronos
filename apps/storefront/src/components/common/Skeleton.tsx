import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
  animate?: boolean;
}

/**
 * A luxurious, modern skeleton loader with a subtle shimmer effect.
 */
export const Skeleton = ({
  className = '',
  width,
  height,
  variant = 'rect',
  animate = true
}: SkeletonProps) => {
  const baseClasses = 'relative overflow-hidden bg-gunmetal/5';

  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4 my-2'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }}
        />
      )}
    </div>
  );
};

export const MediaSkeleton = ({ className = '', aspect = 'aspect-video' }: { className?: string, aspect?: string }) => (
  <Skeleton className={`${aspect} w-full ${className}`} />
);

export const TextSkeleton = ({ lines = 3, className = '' }: { lines?: number, className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '60%' : '100%'}
        className={i === 0 ? 'h-6 mb-4' : ''} // First line taller like a title
      />
    ))}
  </div>
);

export const WatchCardSkeleton = () => (
  <div className="space-y-4">
    <MediaSkeleton aspect="aspect-[3/4]" className="rounded-2xl" />
    <div className="space-y-2 px-2">
      <Skeleton width="40%" height={12} className="opacity-60" />
      <Skeleton width="80%" height={24} />
      <Skeleton width="30%" height={20} className="mt-4" />
    </div>
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="space-y-4">
    <MediaSkeleton aspect="aspect-video" className="rounded-xl" />
    <div className="space-y-2">
      <Skeleton width="30%" height={12} variant="text" />
      <Skeleton width="100%" height={24} />
      <Skeleton width="100%" height={24} />
      <Skeleton width="60%" height={16} variant="text" className="mt-4" />
    </div>
  </div>
);

export const BrandSectionSkeleton = ({ reversed = false }: { reversed?: boolean }) => (
  <section className="py-12 md:py-24 max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className={`aspect-square rounded-2xl overflow-hidden ${reversed ? 'order-2' : 'order-2 md:order-1'}`}>
        <Skeleton className="w-full h-full" />
      </div>
      <div className={`space-y-8 ${reversed ? 'order-1' : 'order-1 md:order-2'}`}>
        <div className="space-y-4">
          <Skeleton width={120} height={12} />
          <Skeleton width="80%" height={48} />
          <Skeleton width={150} height={24} className="opacity-60" />
          <TextSkeleton lines={3} className="max-w-md opacity-40" />
        </div>
        <div className="grid grid-cols-2 gap-y-8 gap-x-12 border-t border-bone/30 pt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton width={60} height={10} />
              <Skeleton width={100} height={18} />
            </div>
          ))}
        </div>
        <Skeleton width={180} height={40} className="rounded-lg" />
      </div>
    </div>
  </section>
);

export const CollectionsGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 xl:gap-x-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <WatchCardSkeleton key={i} />
    ))}
  </div>
);
