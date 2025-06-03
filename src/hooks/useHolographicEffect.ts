import { to, useSpring } from "@react-spring/web";
import React, { CSSProperties, useEffect, useState } from "react";
import { adjust, clamp, round } from "../helpers/Math";

/* interface HolographicEffectState {
  isMobile: boolean;
} */

interface SpringSettings {
  stiffness: number;
  damping: number;
}

export function useHolographicEffect(_showcase = false) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const springInteractSetting: SpringSettings = {
    stiffness: 0.066,
    damping: 0.25,
  };
  const springPopoverSetting: SpringSettings = {
    stiffness: 0.033,
    damping: 0.45,
  };

  const [springRotate, setSpringRotate] = useSpring(() => ({
    from: { x: 0, y: 0 },
    config: springInteractSetting,
  }));

  const [springGlare, setSpringGlare] = useSpring(() => ({
    from: { x: 50, y: 50, o: 0 },
    config: springInteractSetting,
  }));

  const [springBackground, setSpringBackground] = useSpring(() => ({
    x: 50,
    y: 50,
    config: springInteractSetting,
  }));

  const [springRotateDelta, setSpringRotateDelta] = useSpring(() => ({
    x: 0,
    y: 0,
    config: springPopoverSetting,
  }));

  const updateSprings = (
    background: { x: number; y: number },
    rotate: { x: number; y: number },
    glare: { x: number; y: number; o: number }
  ) => {
    setSpringBackground(background);
    setSpringRotate(rotate);
    setSpringGlare(glare);
  };

  const handleInteract = (e: React.MouseEvent) => {
    if (!isVisible || isMobile) return;

    setIsInteracting(true);

    const clientX = e.clientX;
    const clientY = e.clientY;
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    const absolute = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    const percent = {
      x: clamp(round((100 / rect.width) * absolute.x)),
      y: clamp(round((100 / rect.height) * absolute.y)),
    };

    const center = {
      x: percent.x - 50,
      y: percent.y - 50,
    };

    updateSprings(
      {
        x: adjust(percent.x, 0, 100, 37, 63),
        y: adjust(percent.y, 0, 100, 33, 67),
      },
      {
        x: round(-(center.x / 3.5)),
        y: round(center.y / 2),
      },
      {
        x: round(percent.x),
        y: round(percent.y),
        o: 1,
      }
    );
  };

  const handleInteractEnd = (delay: number = 500) => {
    setTimeout(() => {
      const snapSetting = { stiffness: 0.01, damping: 0.06 };

      setIsInteracting(false);

      setSpringRotate({ x: 0, y: 0, config: snapSetting });
      setSpringGlare({ x: 50, y: 50, o: 0, config: snapSetting });
      setSpringBackground({ x: 50, y: 50, config: snapSetting });
    }, delay);
  };

  const retreat = () => {
    setSpringRotateDelta({ x: 0, y: 0 });
    handleInteractEnd(100);
  };

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    setIsVisible(document.visibilityState === "visible");

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
      retreat();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const springStyle: CSSProperties & { [key: string]: any } = {
    "--pointer-x": to(springGlare.x, (x) => `${x}%`),
    "--pointer-y": to(springGlare.y, (y) => `${y}%`),
    "--pointer-from-center": to([springGlare.x, springGlare.y], (x, y) =>
      clamp(Math.sqrt((y - 50) ** 2 + (x - 50) ** 2) / 50, 0, 1)
    ),
    "--pointer-from-top": to(springGlare.y, (y) => y / 100),
    "--pointer-from-left": to(springGlare.x, (x) => x / 100),
    "--card-opacity": springGlare.o,
    "--rotate-x": to(
      [springRotate.x, springRotateDelta.x],
      (x, dx) => `${x + dx}deg`
    ),
    "--rotate-y": to(
      [springRotate.y, springRotateDelta.y],
      (y, dy) => `${y + dy}deg`
    ),
    "--background-x": to(springBackground.x, (x) => `${x}%`),
    "--background-y": to(springBackground.y, (y) => `${y}%`),
  };

  return {
    isMobile,
    isActive,
    isInteracting,
    isLoading,
    setIsActive,
    setIsLoading,
    handleInteract,
    handleInteractEnd,
    retreat,
    springStyle,
  };
}
