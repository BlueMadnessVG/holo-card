import {
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { adjust, clamp, distanceFromCenter, round } from "../helpers/Math";
import type { HolographicEffectState, SpringConfig } from "../types";

// ─── Spring presets ───────────────────────────────────────────────────────────

const SPRING_INTERACT: SpringConfig = { stiffness: 0.066, damping: 0.25 };
const SPRING_POPOVER: SpringConfig  = { stiffness: 0.033, damping: 0.45 };

/**
 * Convert the original "factor" spring config (react-spring style) into
 * Framer Motion's physical spring units.
 *
 * react-spring uses stiffness/damping as coefficients (0–1 range typical).
 * Framer Motion uses real spring physics: stiffness in N/m, damping ratio.
 * Multiplying by 1000/100 preserves the original feel.
 */
const toFMSpring = ({ stiffness, damping }: SpringConfig) => ({
  stiffness: stiffness * 1000,
  damping:   damping   * 100,
  mass: 1,
});

const FM_INTERACT = toFMSpring(SPRING_INTERACT);
const FM_POPOVER  = toFMSpring(SPRING_POPOVER);

// ─── Mobile detection ─────────────────────────────────────────────────────────

const detectMobile = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Manages all reactive state and spring animations for the holographic card
 * effect using Framer Motion MotionValues.
 *
 * Architecture:
 *   raw MotionValue  →  useSpring (smoothed)  →  useTransform (CSS string)
 *
 * Setting a raw value triggers the spring, which drives the transform,
 * which updates the CSS custom property on the DOM — all outside React renders.
 */
export function useHolographicEffect(_showcase = false): HolographicEffectState {
  const [isMobile]                  = useState<boolean>(detectMobile);
  const [isActive,      setIsActive]   = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isLoading,     setIsLoading]  = useState(true);

  const isVisible = useRef(
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true
  );

  // ── Raw target MotionValues ───────────────────────────────────────────────
  // We write to these; the springs below read from them.

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawGlareX  = useMotionValue(50);
  const rawGlareY  = useMotionValue(50);
  const rawGlareO  = useMotionValue(0);
  const rawBgX     = useMotionValue(50);
  const rawBgY     = useMotionValue(50);
  const rawDeltaX  = useMotionValue(0);
  const rawDeltaY  = useMotionValue(0);

  // ── Spring-smoothed outputs ───────────────────────────────────────────────

  const rotateX = useSpring(rawRotateX, FM_INTERACT);
  const rotateY = useSpring(rawRotateY, FM_INTERACT);
  const glareX  = useSpring(rawGlareX,  FM_INTERACT);
  const glareY  = useSpring(rawGlareY,  FM_INTERACT);
  const glareO  = useSpring(rawGlareO,  FM_INTERACT);
  const bgX     = useSpring(rawBgX,     FM_INTERACT);
  const bgY     = useSpring(rawBgY,     FM_INTERACT);
  const deltaX  = useSpring(rawDeltaX,  FM_POPOVER);
  const deltaY  = useSpring(rawDeltaY,  FM_POPOVER);

  // ── CSS custom property MotionValues ──────────────────────────────────────
  // useTransform maps spring output → CSS string. Framer Motion writes these
  // directly to the DOM via the style prop — no React re-renders needed.

  const cssPointerX          = useTransform(glareX, (x) => `${x}%`);
  const cssPointerY          = useTransform(glareY, (y) => `${y}%`);
  const cssPointerFromCenter = useTransform(
    [glareX, glareY] as MotionValue[],
    ([x, y]: number[]) => distanceFromCenter(x, y)
  );
  const cssPointerFromTop    = useTransform(glareY, (y) => y / 100);
  const cssPointerFromLeft   = useTransform(glareX, (x) => x / 100);
  const cssRotateX           = useTransform(
    [rotateX, deltaX] as MotionValue[],
    ([x, dx]: number[]) => `${x + dx}deg`
  );
  const cssRotateY           = useTransform(
    [rotateY, deltaY] as MotionValue[],
    ([y, dy]: number[]) => `${y + dy}deg`
  );
  const cssBackgroundX       = useTransform(bgX, (x) => `${x}%`);
  const cssBackgroundY       = useTransform(bgY, (y) => `${y}%`);

  // ── Reset helpers ─────────────────────────────────────────────────────────

  const snapToRest = useCallback((delay = 500) => {
    const id = setTimeout(() => {
      setIsInteracting(false);
      // Set raw values to their defaults. The springs will animate toward them
      // with whatever stiffness/damping they were initialised with.
      rawRotateX.set(0);
      rawRotateY.set(0);
      rawGlareX.set(50);
      rawGlareY.set(50);
      rawGlareO.set(0);
      rawBgX.set(50);
      rawBgY.set(50);
    }, delay);
    return id;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retreat = useCallback(() => {
    rawDeltaX.set(0);
    rawDeltaY.set(0);
    snapToRest(100);
  }, [rawDeltaX, rawDeltaY, snapToRest]);

  // ── Interaction handlers ──────────────────────────────────────────────────

  const handleInteract = useCallback((e: React.MouseEvent<Element>) => {
    if (!isVisible.current || isMobile) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const percent = {
      x: clamp(round((100 / rect.width)  * (e.clientX - rect.left))),
      y: clamp(round((100 / rect.height) * (e.clientY - rect.top))),
    };
    const center = { x: percent.x - 50, y: percent.y - 50 };

    setIsInteracting(true);
    rawBgX.set(adjust(percent.x, 0, 100, 37, 63));
    rawBgY.set(adjust(percent.y, 0, 100, 33, 67));
    rawRotateX.set(round(-(center.x / 3.5)));
    rawRotateY.set(round(center.y / 2));
    rawGlareX.set(round(percent.x));
    rawGlareY.set(round(percent.y));
    rawGlareO.set(1);
  }, [isMobile, rawBgX, rawBgY, rawRotateX, rawRotateY, rawGlareX, rawGlareY, rawGlareO]);

  const handleInteractEnd = useCallback((delay = 500) => {
    snapToRest(delay);
  }, [snapToRest]);

  // ── Visibility listener ───────────────────────────────────────────────────

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onChange = () => {
      isVisible.current = document.visibilityState === "visible";
      if (!isVisible.current) retreat();
    };
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, [retreat]);

  // ── Spring style map ──────────────────────────────────────────────────────
  // Spread this onto a `<motion.div>` — Framer Motion subscribes to each
  // MotionValue and updates the CSS custom property directly on the DOM node,
  // completely bypassing React's reconciler for every animation frame.

  const springStyle: Record<string, MotionValue | unknown> = {
    "--pointer-x":           cssPointerX,
    "--pointer-y":           cssPointerY,
    "--pointer-from-center": cssPointerFromCenter,
    "--pointer-from-top":    cssPointerFromTop,
    "--pointer-from-left":   cssPointerFromLeft,
    "--card-opacity":        glareO,
    "--rotate-x":            cssRotateX,
    "--rotate-y":            cssRotateY,
    "--background-x":        cssBackgroundX,
    "--background-y":        cssBackgroundY,
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