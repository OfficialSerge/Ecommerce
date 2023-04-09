"use client"

import { useEffect, useState } from "react";

export const useDisplay = () => {
  const [display, setDisplay] = useState<string | null>(null)

  useEffect(() => {
    function setFromEvent() {
      const width = window.innerWidth

      if (width >= 1024) {
        setDisplay("desktop")
      } else if (width >= 768) {
        setDisplay("tablet")
      } else {
        setDisplay("mobile")
      }
    }
    window.addEventListener("resize", setFromEvent);
    setFromEvent()

    return () => {
      window.removeEventListener("resize", setFromEvent);
    };
  }, []);

  return display;
};
