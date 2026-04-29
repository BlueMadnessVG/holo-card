import type { HolographicEffectState } from "../types";
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
export declare function useHolographicEffect(_showcase?: boolean): HolographicEffectState;
