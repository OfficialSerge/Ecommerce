"use client"

import { useEffect, useRef } from "react";

export const useMousePosition = () => {
  const positionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function setFromEvent(e: MouseEvent) {
      const width = e.view?.innerWidth || 1
      const height = e.view?.innerHeight || 1

      const x_relative = e.clientX / width
      const y_relative = e.clientY / height

      positionRef.current.x = x_relative
      positionRef.current.y = y_relative
    }
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  return positionRef;
};
