import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * useResizable – lightweight drag-to-resize hook.
 *
 * Uses a ref to track current size during drag so onMouseDown never needs
 * to be recreated (stable reference across renders).
 *
 * @param {object} opts
 * @param {number}  opts.initial      – initial size in pixels
 * @param {number}  opts.min          – minimum size in pixels
 * @param {number}  opts.max          – maximum size in pixels
 * @param {'horizontal'|'vertical'} opts.direction
 * @param {string}  [opts.storageKey] – localStorage key for persistence
 */
export function useResizable({ initial, min, max, direction = 'horizontal', storageKey }) {
  const getInitial = () => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const n = Number(saved);
        if (Number.isFinite(n) && n >= min && n <= max) return n;
      }
    }
    return initial;
  };

  const [size, setSize] = useState(getInitial);
  // Keep a ref so onMouseDown closure always reads the latest size
  const sizeRef = useRef(size);
  useEffect(() => { sizeRef.current = size; }, [size]);

  // Persist on size change
  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, String(size));
  }, [size, storageKey]);

  // Stable callback — never recreated
  const onMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      const startPos  = direction === 'horizontal' ? e.clientX : e.clientY;
      const startSize = sizeRef.current;

      const onMouseMove = (ev) => {
        const delta = direction === 'horizontal'
          ? ev.clientX - startPos
          : ev.clientY - startPos;
        setSize(Math.min(max, Math.max(min, startSize + delta)));
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    // min/max/direction are stable across renders; no size dependency needed
    [min, max, direction]
  );

  return { size, onMouseDown };
}
