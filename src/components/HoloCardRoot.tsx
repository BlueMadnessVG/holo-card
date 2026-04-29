import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useHolographicEffect } from "../hooks/useHolographicEffect";
import type { HoloCardRootProps } from "../types";

// ── Styles — imported here so consumers never need to import them manually ──
import "../styles/Card.css";
import "../styles/Card_Normal.css";
import "../styles/Card_Radiant.css";
import "../styles/Card_Rainbow.css";
import "../styles/Card_shiny.css";
import "../styles/Card_shiny_raycast.css";
import "../styles/Card_Glittery.css";

const toRadiusCSS = (radius: number | string): string =>
  typeof radius === "number" ? `${radius}px` : radius;

/**
 * `HoloCardRoot` is the composable shell — it provides the tilt, glare, and
 * shine spring animations without imposing any inner structure.
 *
 * Foil and mask textures are applied to the `card_front` wrapper that
 * HoloCardRoot renders internally around your children.
 *
 * ```tsx
 * <HoloCardRoot
 *   dataSet="Shiny"
 *   foil="/textures/foil.png"
 *   mask="/textures/mask.png"
 *   cardStyle={{ "--seedx": 0.5, "--seedy": 0.3 }}
 * >
 *   <GameCardPoster />
 *   <GameCardHUD />
 * </HoloCardRoot>
 * ```
 *
 * The shine and glare layers are rendered automatically as siblings of
 * card_front inside the grid stacking context.
 */
export function HoloCardRoot({
  children,
  radius,
  dataSet = "Normal",
  enableEffect = true,
  mask = "",
  foil = "",
  cardStyle,
  className,
  style,
  onClick,
}: HoloCardRootProps) {
  const [foilStyles, setFoilStyles] = useState<Record<string, string>>(() => {
    if (mask || foil) {
      return {
        ...(mask && { "--mask": `url(${mask})` }),
        ...(foil && { "--foil": `url(${foil})` }),
      };
    }
    return {};
  });

  const {
    isActive,
    isInteracting,
    setIsActive,
    handleInteract,
    handleInteractEnd,
    springStyle,
  } = useHolographicEffect();

  const handleToggleActive = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive, setIsActive]);

  const handleMouseLeave = useCallback(
    () => handleInteractEnd(),
    [handleInteractEnd]
  );

  const handleFoilLoad = useCallback(() => {
    if (mask || foil) {
      setFoilStyles({
        ...(mask && { "--mask": `url(${mask})` }),
        ...(foil && { "--foil": `url(${foil})` }),
      });
    }
  }, [foil, mask]);

  const cardClasses = useMemo(
    () =>
      [
        "card",
        "interactive",
        isActive && "active",
        isInteracting && "interacting",
        mask && "masked",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [isActive, isInteracting, mask, className]
  );

  const outerStyle = useMemo(
    () => ({
      ...springStyle,
      ...(radius !== undefined && { "--card-radius": toRadiusCSS(radius) }),
      ...style,
    }),
    [springStyle, radius, style]
  );

  const frontStyle = useMemo(
    () => ({ ...foilStyles, ...cardStyle }),
    [foilStyles, cardStyle]
  );

  return (
    <motion.div
      className={cardClasses}
      style={outerStyle}
      data-set={dataSet}
    >
      <div className="card_translater">
        <motion.button
          className="card_rotator"
          onClick={onClick ?? handleToggleActive}
          onMouseMove={enableEffect ? handleInteract : undefined}
          onMouseLeave={enableEffect ? handleMouseLeave : undefined}
          aria-label="Interactive holographic card"
          aria-pressed={isActive}
        >
          <div className="card_front" style={frontStyle}>
            {typeof children === "function"
              ? children({ onFoilLoad: handleFoilLoad })
              : children}
          </div>

          <div className="card_shine" aria-hidden="true" />
          <div className="card_glare" aria-hidden="true" />
        </motion.button>
      </div>
    </motion.div>
  );
}