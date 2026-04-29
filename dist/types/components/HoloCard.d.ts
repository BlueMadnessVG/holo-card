import type { HoloCardProps } from "../types";
/**
 * `HoloCard` is the batteries-included component — image in, holographic card out.
 *
 * For custom layouts, use `HoloCardRoot` instead and put your own children inside.
 *
 * ```tsx
 * // Simple usage
 * <HoloCard img="/cards/pikachu.jpg" dataSet="Shiny" />
 *
 * // Custom layout
 * <HoloCardRoot dataSet="Shiny">
 *   <GameCardPoster src={game.coverUrl} />
 *   <GameCardHUD title={game.title} />
 * </HoloCardRoot>
 * ```
 */
export declare function HoloCard({ img, alt, radius, foil, mask, dataSet, enableEffect, onLoad, }: HoloCardProps): import("react/jsx-runtime").JSX.Element;
