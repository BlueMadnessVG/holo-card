/// <reference types="react" />
export type HoloStyle = "Shiny" | "Shiny_raycast" | "Normal" | "Vibrant" | "Radiant" | "Glittery" | "Disable";
export interface SpringConfig {
    stiffness: number;
    damping: number;
}
export interface HolographicEffectState {
    /** Whether the user's device is mobile (pointer-based detection) */
    isMobile: boolean;
    /** Whether the card is in an "active" (clicked/toggled) state */
    isActive: boolean;
    /** Whether the user is currently hovering/interacting */
    isInteracting: boolean;
    /** Whether the card image is still loading */
    isLoading: boolean;
    setIsActive: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    handleInteract: (e: React.MouseEvent<Element>) => void;
    handleInteractEnd: (delay?: number) => void;
    retreat: () => void;
    /** Animated CSS custom-property styles — spread onto an `<animated.*>` element */
    springStyle: Record<string, unknown>;
}
export interface HoloCardProps {
    /** URL of the card face image (required) */
    img: string;
    /** Alt text for the card image */
    alt?: string;
    /** Border radius — number is treated as px, string is used verbatim */
    radius?: number | string;
    /** URL of a foil overlay texture */
    foil?: string;
    /** URL of a mask image */
    mask?: string;
    /** Whether the tilt/glare interaction is enabled (default: true) */
    enableEffect?: boolean;
    /** Holographic visual style (default: "Normal") */
    dataSet?: HoloStyle;
    /** Called when the card image finishes loading */
    onLoad?: () => void;
}
