import React, { useRef, useState } from "react";
import { useHolographicEffect } from "../hooks/useHolographicEffect";
import { animated } from "@react-spring/web";
import '../styles/Card.css';
import '../styles/Card_Normal.css';
import '../styles/Card_Radiant.css';
import '../styles/Card_Rainbow.css';
import '../styles/Card_Shiny.css';
import '../styles/Card_Shiny_raycast.css';
import '../styles/Card_Glittery.css';

interface CardProps {
  img: string;
  radius?: number | string;
  foil?: string;
  mask?: string;
  enableEffect?: boolean;
  data_set?:
    | "Shiny"
    | "Shiny_raycast"
    | "Normal"
    | "Vibrant"
    | "Radiant"
    | "Glittery"
    | "Disable";
}

export function HoloCard({
  img,
  radius,
  foil = "",
  mask = "",
  data_set = "Normal",
  enableEffect = true,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [randomSeed] = useState({ x: Math.random(), y: Math.random() });
  const [cosmosPosition] = useState({
    x: Math.floor(randomSeed.x * 734),
    y: Math.floor(randomSeed.y * 1280),
  });
  const [foilStyles, setFoilStyles] = useState<Record<string, string>>({});

  const {
    isActive,
    isInteracting,
    setIsActive,
    setIsLoading,
    handleInteract,
    handleInteractEnd,
    springStyle,
  } = useHolographicEffect(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    if (mask || foil) {
      setFoilStyles({
        "--mask": `url(${mask})`,
        "--foil": `url(${foil})`,
      });
    }
  };

  const staticStyles: React.CSSProperties & Record<string, string | number> = {
    "--seedx": randomSeed.x,
    "--seedy": randomSeed.y,
    "--cosmosbg": `${cosmosPosition.x}px ${cosmosPosition.y}px`,
  };

  const combinedStyles = {
    ...staticStyles,
    ...foilStyles,
  };

  const handleActive = () => {
    setIsActive(!isActive);
  };

  const cardClasses = [
    "card",
    "interactive",
    isActive ? "active" : "",
    isInteracting ? "interacting" : "",
    mask ? "masked" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <animated.div
      ref={cardRef}
      className={cardClasses}
      style={{
        ...springStyle,
        ...(radius !== undefined && {
          "--card-radius": typeof radius === "number" ? `${radius}px` : radius,
        }),
      }}
      data-set={data_set}
    >
      <div className={"card_translater"}>
        <animated.button
          className={"card_rotator"}
          onClick={handleActive}
          onMouseMove={enableEffect ? handleInteract : undefined}
          onMouseLeave={enableEffect ? () => handleInteractEnd() : undefined}
          aria-label="Interactive card"
          tabIndex={0}
        >
          <div className={"card_front"} style={combinedStyles}>
            <img
              src={img}
              alt="img alt"
              onLoad={handleImageLoad}
              loading="lazy"
            />
            <div className={"card_shine"} />
            <div className={"card_glare"} />
          </div>
        </animated.button>
      </div>
    </animated.div>
  );
}
