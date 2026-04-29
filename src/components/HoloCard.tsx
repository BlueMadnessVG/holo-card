import React, { useCallback, useMemo, useRef } from "react";
import { HoloCardRoot } from "./HoloCardRoot";
import type { HoloCardProps } from "../types";

const useStableSeeds = () =>
  useRef({ seedX: Math.random(), seedY: Math.random() }).current;

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

  const cardStyle = useMemo(
    () => ({
      "--seedx": seedX,
      "--seedy": seedY,
      "--cosmosbg": `${Math.floor(seedX * 734)}px ${Math.floor(seedY * 1280)}px`,
    }),
    []
  );

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  return (
    <HoloCardRoot
      radius={radius}
      foil={foil}      
      mask={mask}      
      dataSet={dataSet}
      enableEffect={enableEffect}
      cardStyle={cardStyle} 
    >
      {({ onFoilLoad }) => (
        <img
          src={img}
          alt={alt}
          onLoad={() => { onFoilLoad(); handleLoad(); }}
          loading="lazy"
          draggable={false}
        />
      )}
    </HoloCardRoot>
  );
}