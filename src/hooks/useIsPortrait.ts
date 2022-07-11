import { useCallback, useEffect, useState } from 'react';

function useIsPortrait(): boolean {
  const [isPortrait, setIsPortrait] = useState<boolean>(false);

  const updateOrientation = useCallback((event: MediaQueryListEvent) => {
    if (event.matches) {
      // Portrait mode
      setIsPortrait(true);
    } else {
      // Landscape
      setIsPortrait(false);
    }
  }, []);

  useEffect(() => {
    const portrait = window.matchMedia('(orientation: portrait)');

    if (portrait.matches) {
      setIsPortrait(true);
    }

    portrait.addEventListener('change', updateOrientation);
    return () => portrait.removeEventListener('change', updateOrientation);
  }, [updateOrientation]);

  useEffect(() => {
    console.log('isPortrait: ', isPortrait);
  }, [isPortrait]);

  return isPortrait;
}

export default useIsPortrait;
