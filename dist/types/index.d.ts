import type { CSSProperties } from "react";
import type { MotionValue } from "framer-motion";
export type HoloStyle = "Shiny" | "Shiny_raycast" | "Normal" | "Vibrant" | "Radiant" | "Glittery" | "Disable";
export interface SpringConfig {
    stiffness: number;
    damping: number;
}
export interface HolographicEffectState {
    isMobile: boolean;
    isActive: boolean;
    isInteracting: boolean;
    isLoading: boolean;
    setIsActive: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    handleInteract: (e: React.MouseEvent<Element>) => void;
    handleInteractEnd: (delay?: number) => void;
    retreat: () => void;
    springStyle: Record<string, MotionValue | unknown>;
}
export interface HoloCardRootChildContext {
    /**
     * Call this when a foil/mask image finishes loading.
     * Activates the texture at the right moment instead of applying it
     * before the image is ready.
     *
     * ```tsx
     * <HoloCardRoot foil="/foil.png">
     *   {({ onFoilLoad }) => (
     *     <img src="/card.jpg" onLoad={onFoilLoad} />
     *   )}
     * </HoloCardRoot>
     * ```
     */
    onFoilLoad: () => void;
}
export interface HoloCardRootProps {
    children: React.ReactNode | ((ctx: HoloCardRootChildContext) => React.ReactNode);
    radius?: number | string;
    dataSet?: HoloStyle;
    enableEffect?: boolean;
    mask?: string;
    foil?: string;
    cardStyle?: CSSProperties & Record<string, unknown>;
    className?: string;
    style?: CSSProperties & Record<string, unknown>;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
export interface HoloCardProps extends Omit<HoloCardRootProps, "children" | "onClick" | "cardStyle"> {
    img: string;
    alt?: string;
    onLoad?: () => void;
}
