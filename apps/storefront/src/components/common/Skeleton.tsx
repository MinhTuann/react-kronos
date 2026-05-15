import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
  animate?: boolean;
}

export const Skeleton = ({
  className = '',
  width,
  height,
  variant = 'rect',
  animate = true,
}: SkeletonProps) => {
  const baseClasses = 'relative overflow-hidden bg-gunmetal/5';

  const variantClasses = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4 my-2',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      {animate && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
};

export const MediaSkeleton = ({ className = '', aspect = 'aspect-video' }: { className?: string; aspect?: string }) => (
  <Skeleton className={`${aspect} w-full ${className}`} />
);

export const TextSkeleton = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        variant="text"
        width={index === lines - 1 ? '60%' : '100%'}
        className={index === 0 ? 'h-6 mb-4' : ''}
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

export const CollectionsGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-y-16 xl:gap-x-8">
    {Array.from({ length: 8 }).map((_, index) => (
      <WatchCardSkeleton key={index} />
    ))}
  </div>
);
