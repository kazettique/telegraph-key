// ref: https://thewebdev.info/2021/02/27/how-to-detect-a-touch-screen-device-using-javascript/

function useIsTouchDevice1() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function useIsTouchDevice2() {
  return window.matchMedia('(pointer: coarse)').matches;
}

export { useIsTouchDevice1, useIsTouchDevice2 };
