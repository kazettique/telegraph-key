import { useIsTouchDevice1, useIsTouchDevice2 } from '@/hooks';
import { useEffect, useRef, useState } from 'react';

const clearTimer = (timerRef: NodeJS.Timeout) => clearInterval(timerRef);

const DIT = '.';
const DAH = '-';
const ALPHABET_GAP = '*';
const WORD_GAP = '/';
const DEBOUNCE_INTERVAL_IN_MS = 200;
const IDLE_INTERVAL_IN_MS = 300;

const DAH_THRESHOLD_LENGTH = 1;
const ALPHABET_GAP_THRESHOLD_MIN_LENGTH = 3;
const WORD_GAP_THRESHOLD_MIN_LENGTH = 8;

const INITIAL_COUNT = 0;
const INITIAL_REF = '';
const INITIAL_GRAPH: string[] = [];

function Telegraph() {
  const [graph, setGraph] = useState<string[]>(INITIAL_GRAPH);
  const [debounceCount, setDebounceCount] = useState<number>(INITIAL_COUNT);
  const [idleCount, setIdleCount] = useState<number>(INITIAL_COUNT);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const idleTimerRef = useRef<NodeJS.Timeout>();
  const currentGraph = useRef<string>(INITIAL_REF);
  const emptyGraph = useRef<string>(INITIAL_REF);
  const isTouchDevice1 = useIsTouchDevice1();
  const isTouchDevice2 = useIsTouchDevice2();

  const clearDebounceTimer = () => {
    if (debounceTimerRef.current) {
      clearTimer(debounceTimerRef.current);
    }
  };

  const clearIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimer(idleTimerRef.current);
    }
  };

  const startDebounceTimer = () => {
    setDebounceCount((prev) => prev + 1);
    currentGraph.current += DIT;
  };

  const startIdleTimer = () => {
    setIdleCount((prev) => prev + 1);
    emptyGraph.current += ALPHABET_GAP;
  };

  const resetDebounceCount = () => {
    currentGraph.current = INITIAL_REF;
    setDebounceCount(INITIAL_COUNT);
  };

  const resetIdleCount = () => {
    emptyGraph.current = INITIAL_REF;
    setIdleCount(INITIAL_COUNT);
  };

  const createNewGraph = () => {
    // todo: consider two mouse buttons clicked situation
    clearDebounceTimer();
    currentGraph.current += DIT;
    debounceTimerRef.current = setInterval(startDebounceTimer, DEBOUNCE_INTERVAL_IN_MS);
  };

  const createEmptyGraph = () => {
    clearIdleTimer();
    emptyGraph.current += ALPHABET_GAP;
    idleTimerRef.current = setInterval(startIdleTimer, IDLE_INTERVAL_IN_MS);
  };

  const finishNewGraph = () => {
    const newGraph = currentGraph.current;
    const parsedNewGraph = newGraph.length > DAH_THRESHOLD_LENGTH ? DAH : newGraph;
    setGraph((prev) => [...prev, parsedNewGraph]);
  };

  const finishEmptyGraph = () => {
    const newGraph = emptyGraph.current;
    console.log('newGraph', newGraph);
    let parsedNewGraph = '';
    if (newGraph.length >= ALPHABET_GAP_THRESHOLD_MIN_LENGTH && newGraph.length <= WORD_GAP_THRESHOLD_MIN_LENGTH) {
      parsedNewGraph = ALPHABET_GAP;
    } else if (newGraph.length > WORD_GAP_THRESHOLD_MIN_LENGTH) {
      parsedNewGraph = WORD_GAP;
    }

    if (parsedNewGraph) {
      setGraph((prev) => [...prev, parsedNewGraph]);
    }
  };

  // for desktop
  const handleMouseDown = () => {
    console.log('[Event] mouse down');
    if (isTouchDevice1) return;
    createNewGraph();

    finishEmptyGraph();
    clearIdleTimer();
    resetIdleCount();
  };

  const handleMouseUp = () => {
    console.log('[Event] mouse up');
    if (isTouchDevice1) return;
    finishNewGraph();
    clearDebounceTimer();
    resetDebounceCount();

    createEmptyGraph();
  };

  // for touch device
  const handleTouchStart = () => {
    console.log('[Event] touch start');
    createNewGraph();
  };

  const handleTouchEnd = () => {
    console.log('[Event] touch end');
    finishNewGraph();
    resetDebounceCount();
  };

  // const handleMouseLeave = () => {
  //   console.log('[Event] mouse leave');
  //   resetTimer();
  // };

  // const handleMouseOut = () => {
  //   console.log('[Event] mouse out');
  //   resetTimer();
  // };

  // disable right click for mouse & touch device
  // ref: https://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page
  useEffect(() => {
    document.addEventListener('contextmenu', (event) => {
      console.log('[Event] add contextmenu');
      event.preventDefault();
    });

    return () => {
      document.removeEventListener('contextmenu', (event) => {
        console.log('[Event] remove contextmenu');
      });
    };
  }, []);

  const handleResetGraph = () => {
    clearDebounceTimer();
    resetDebounceCount();
    setGraph([]);
  };

  const handleDecode = () => {
    console.log('start decode!');
  };

  useEffect(() => {
    if (idleCount % 10 === 0) {
      clearIdleTimer();
    }
  }, [idleCount]);

  return (
    <div className="h-full w-full flex flex-col select-none">
      <div className="shrink-0 text-center uppercase text-xl font-bold text-neutral-800 bg-neutral-300 p-3">
        Morse Code Converter
      </div>
      <div className="flex border border-neutral-800 rounded m-2 grow overflow-auto h-fit">
        <div className="flex flex-wrap h-fit">
          {graph.map((item, index) => (
            <div key={index} className="bg-neutral-300 rounded p-2 m-2 h-fit">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex flex-col justify-center items-center p-2">
        <div className="flex m-2">
          <button
            type="button"
            className="block bg-neutral-100 active:bg-neutral-200 shadow rounded py-2 px-2 my-0 mx-2 uppercase"
            onClick={handleResetGraph}
          >
            clear
          </button>
          <button
            type="button"
            className="block bg-blue-200 active:bg-blue-300 shadow rounded py-2 px-2 my-0 mx-2 uppercase"
            onClick={handleDecode}
          >
            decode
          </button>
        </div>
        <div>
          <span className="px-2">Debounce: {debounceCount}</span>
          <span className="px-2">Idle: {idleCount}</span>
        </div>
        <button
          type="button"
          className="block bg-neutral-400 active:bg-neutral-500 shadow rounded w-full py-5 px-10 my-0 mx-2 uppercase shrink-0"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          // onMouseLeave={handleMouseLeave}
          // onMouseOut={handleMouseOut}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          click
        </button>
      </div>
    </div>
  );
}

export default Telegraph;
