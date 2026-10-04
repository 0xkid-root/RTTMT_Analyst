import { useState, useRef, useEffect } from 'react';

export function useAnimatedNumber(value: number, duration: number = 700) {
  const [displayValue, setDisplayValue] = useState(value);
  const valueRef = useRef(0);
  const targetValueRef = useRef(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      valueRef.current = value;
      targetValueRef.current = value;
      return;
    }

    const startValue = isFirstRender.current ? 0 : valueRef.current;
    const endValue = value;

    if (startValue === endValue && !isFirstRender.current) return;

    targetValueRef.current = value;
    isFirstRender.current = false;

    const startTime = performance.now();
    let frameId: number;

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (endValue - startValue) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        valueRef.current = endValue;
      }
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return Math.round(displayValue);
}
