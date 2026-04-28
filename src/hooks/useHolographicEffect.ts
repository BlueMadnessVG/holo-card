import { to, useSpring } from "@react-spring/web";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { adjust, clamp, distanceFromCenter, round } from "../helpers/Math";
import type { HolographicEffectState, SpringConfig } from "../types";

// ─── Spring presets ───────────────────────────────────────────────────────────

const SPRING_INTERACT: SpringConfig = { stiffness: 0.066, damping: 0.25 };
const SPRING_POPOVER: SpringConfig  = { stiffness: 0.033, damping: 0.45 };
const SPRING_SNAP: SpringConfig     = { stiffness: 0.01,  damping: 0.06 };

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_ROTATE    = { x: 0,  y: 0  };
const DEFAULT_GLARE     = { x: 50, y: 50, o: 0 };
const DEFAULT_BACKGROUND = { x: 50, y: 50 };

// ─── Mobile detection (pointer, not UA sniffing) ─────────────────────────────

const detectMobile = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages all reactive state and spring animations for the holographic card
 * effect. Returns everything needed to wire up a card element.
 *
 * @param showcase - Reserved for future auto-cycle / showcase mode.
 */
export function useHolographicEffect(_showcase = false): HolographicEffectState {
  const [isMobile]      = useState<boolean>(detectMobile);
  const [isActive,      setIsActive]      = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLoading,     setIsLoading]     = useState(true);

  // Track visibility to pause animations when the tab is hidden.
  const isVisible = useRef(
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true
  );

  // ── Springs ────────────────────────────────────────────────────────────────

  const [springRotate,      setSpringRotate]      = useSpring(() => ({ from: DEFAULT_ROTATE,     config: SPRING_INTERACT }));
  const [springGlare,       setSpringGlare]       = useSpring(() => ({ from: DEFAULT_GLARE,      config: SPRING_INTERACT }));
  const [springBackground,  setSpringBackground]  = useSpring(() => ({ ...DEFAULT_BACKGROUND,    config: SPRING_INTERACT }));
  const [springRotateDelta, setSpringRotateDelta] = useSpring(() => ({ x: 0, y: 0,               config: SPRING_POPOVER  }));

  // ── Handlers ───────────────────────────────────────────────────────────────

  const snapToRest = useCallback((delay = 500) => {
    const id = setTimeout(() => {
      setIsInteracting(false);
      setSpringRotate    ({ ...DEFAULT_ROTATE,      config: SPRING_SNAP });
      setSpringGlare     ({ ...DEFAULT_GLARE,       config: SPRING_SNAP });
      setSpringBackground({ ...DEFAULT_BACKGROUND,  config: SPRING_SNAP });
    }, delay);
    return id;
  }, [setSpringBackground, setSpringGlare, setSpringRotate]);

  const retreat = useCallback(() => {
    setSpringRotateDelta({ x: 0, y: 0 });
    snapToRest(100);
  }, [setSpringRotateDelta, snapToRest]);

  const handleInteract = useCallback((e: React.MouseEvent<Element>) => {
    if (!isVisible.current || isMobile) return;

    const target = e.currentTarget as HTMLElement;
    const rect   = target.getBoundingClientRect();

    const percent = {
      x: clamp(round((100 / rect.width)  * (e.clientX - rect.left))),
      y: clamp(round((100 / rect.height) * (e.clientY - rect.top))),
    };

    const center = { x: percent.x - 50, y: percent.y - 50 };

    setIsInteracting(true);
    setSpringBackground({
      x: adjust(percent.x, 0, 100, 37, 63),
      y: adjust(percent.y, 0, 100, 33, 67),
    });
    setSpringRotate({
      x: round(-(center.x / 3.5)),
      y: round(center.y / 2),
    });
    setSpringGlare({
      x: round(percent.x),
      y: round(percent.y),
      o: 1,
    });
  }, [isMobile, setSpringBackground, setSpringRotate, setSpringGlare]);

  const handleInteractEnd = useCallback((delay = 500) => {
    snapToRest(delay);
  }, [snapToRest]);

  // ── Visibility listener ────────────────────────────────────────────────────

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onVisibilityChange = () => {
      isVisible.current = document.visibilityState === "visible";
      if (!isVisible.current) retreat();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [retreat]);

  // ── Spring style map (CSS custom properties) ───────────────────────────────

  const springStyle: Record<string, unknown> = {
    "--pointer-x":            to(springGlare.x, (x) => `${x}%`),
    "--pointer-y":            to(springGlare.y, (y) => `${y}%`),
    "--pointer-from-center":  to([springGlare.x, springGlare.y], distanceFromCenter),
    "--pointer-from-top":     to(springGlare.y, (y) => y / 100),
    "--pointer-from-left":    to(springGlare.x, (x) => x / 100),
    "--card-opacity":         springGlare.o,
    "--rotate-x":             to([springRotate.x, springRotateDelta.x], (x, dx) => `${x + dx}deg`),
    "--rotate-y":             to([springRotate.y, springRotateDelta.y], (y, dy) => `${y + dy}deg`),
    "--background-x":         to(springBackground.x, (x) => `${x}%`),
    "--background-y":         to(springBackground.y, (y) => `${y}%`),
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
