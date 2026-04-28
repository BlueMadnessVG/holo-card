import type { HoloCardProps } from "../types";
/**
 * `HoloCard` renders a holographic trading-card style component with tilt,
 * glare, and shine effects driven by react-spring.
 *
 * @example
 * ```tsx
 * <HoloCard img="/cards/charizard.jpg" dataSet="Shiny" />
 * ```
 */
export declare function HoloCard({ img, alt, radius, foil, mask, dataSet, enableEffect, onLoad, }: HoloCardProps): import("react/jsx-runtime").JSX.Element;
