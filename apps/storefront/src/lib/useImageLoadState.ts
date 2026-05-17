import { useEffect, useState } from 'react';

type UseImageLoadStateOptions = {
  eager?: boolean;
};

export const useImageLoadState = (
  src?: string,
  options?: UseImageLoadStateOptions,
) => {
  const [isReady, setIsReady] = useState(() => !src);

  useEffect(() => {
    if (!src) {
      setIsReady(true);
      return;
    }

    if (typeof window === 'undefined') {
      setIsReady(true);
      return;
    }

    let isMounted = true;
    setIsReady(false);

    const preload = new window.Image();
    preload.decoding = options?.eager ? 'sync' : 'async';

    const markReady = () => {
      if (isMounted) {
        setIsReady(true);
      }
    };

    preload.onload = markReady;
    preload.onerror = markReady;
    preload.src = src;

    if (preload.complete && preload.naturalWidth > 0) {
      markReady();
    }

    return () => {
      isMounted = false;
      preload.onload = null;
      preload.onerror = null;
    };
  }, [options?.eager, src]);

  return {
    isReady,
    markReady: () => setIsReady(true),
  };
};
