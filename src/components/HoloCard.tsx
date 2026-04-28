import { animated } from "@react-spring/web";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useHolographicEffect } from "../hooks/useHolographicEffect";
import type { HoloCardProps } from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a radius prop value to a CSS string */
const toRadiusCSS = (radius: number | string): string =>
  typeof radius === "number" ? `${radius}px` : radius;

/**
 * Generate stable random seed values for CSS shimmer positioning.
 * Using `useRef` so they never cause a re-render.
 */
const useStableSeeds = () =>
  useRef({
    seedX: Math.random(),
    seedY: Math.random(),
  }).current;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * `HoloCard` renders a holographic trading-card style component with tilt,
 * glare, and shine effects driven by react-spring.
 *
 * @example
 * ```tsx
 * <HoloCard img="/cards/charizard.jpg" dataSet="Shiny" />
 * ```
 */
export function HoloCard({
  img,
  alt = "Holographic card",
  radius,
  foil = "",
  mask = "",
  dataSet = "Normal",
  enableEffect = true,
  onLoad,
}: HoloCardProps) {
  const { seedX, seedY } = useStableSeeds();
  const cosmosX = Math.floor(seedX * 734);
  const cosmosY = Math.floor(seedY * 1280);

  const [foilStyles, setFoilStyles] = useState<Record<string, string>>({});

  const {
    isActive,
    isInteracting,
    setIsActive,
    setIsLoading,
    handleInteract,
    handleInteractEnd,
    springStyle,
  } = useHolographicEffect();

  // ── Derived / memoised values ──────────────────────────────────────────────

  /**
   * Static CSS custom properties. These never change after mount so memo
   * prevents them from being recalculated on every render.
   */
  const staticStyles = useMemo<React.CSSProperties & Record<string, unknown>>(
    () => ({
      "--seedx":     seedX,
      "--seedy":     seedY,
      "--cosmosbg":  `${cosmosX}px ${cosmosY}px`,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // seeds never change
  );

  const combinedCardStyles = useMemo(
    () => ({ ...staticStyles, ...foilStyles }),
    [staticStyles, foilStyles]
  );

  const outerStyle = useMemo(
    () => ({
      ...springStyle,
      ...(radius !== undefined && { "--card-radius": toRadiusCSS(radius) }),
    }),
    [springStyle, radius]
  );

  const cardClasses = useMemo(
    () =>
      ["card", "interactive", isActive && "active", isInteracting && "interacting", mask && "masked"]
        .filter(Boolean)
        .join(" "),
    [isActive, isInteracting, mask]
  );

  // ── Callbacks ──────────────────────────────────────────────────────────────

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    if (mask || foil) {
      setFoilStyles({
        "--mask": `url(${mask})`,
        "--foil": `url(${foil})`,
      });
    }
    onLoad?.();
  }, [foil, mask, onLoad, setIsLoading]);

  const handleToggleActive = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive, setIsActive]);

  const handleMouseLeave = useCallback(() => {
    handleInteractEnd();
  }, [handleInteractEnd]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <animated.div
      className={cardClasses}
      style={outerStyle as  React.CSSProperties}
      data-set={dataSet}
    >
      <div className="card_translater">
        <animated.button
          className="card_rotator"
          onClick={handleToggleActive}
          onMouseMove={enableEffect ? handleInteract : undefined}
          onMouseLeave={enableEffect ? handleMouseLeave : undefined}
          aria-label="Interactive holographic card"
          aria-pressed={isActive}
        >
          <div className="card_front" style={combinedCardStyles}>
            <img
              src={img}
              alt={alt}
              onLoad={handleImageLoad}
              loading="lazy"
              draggable={false}
            />
            <div className="card_shine" aria-hidden="true" />
            <div className="card_glare" aria-hidden="true" />
          </div>
        </animated.button>
      </div>
    </animated.div>
  );
}
