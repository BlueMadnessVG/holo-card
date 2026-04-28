import type { HolographicEffectState } from "../types";
/**
 * Manages all reactive state and spring animations for the holographic card
 * effect. Returns everything needed to wire up a card element.
 *
 * @param showcase - Reserved for future auto-cycle / showcase mode.
 */
export declare function useHolographicEffect(_showcase?: boolean): HolographicEffectState;
