import { useRef } from 'react';

// ref: https://www.freecodecamp.org/news/javascript-debounce-example/
function useDebounce(debounceFunc: () => void, debounceTimeInMs = 300) {
  const timerRef = useRef<NodeJS.Timeout>();

  const debounceCallBack = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(debounceFunc, debounceTimeInMs);
  };

  return debounceCallBack;
}

export default useDebounce;
