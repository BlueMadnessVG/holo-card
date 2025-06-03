import React from "react";
import "../styles/Card.css";
import "../styles/Card_shiny.css";
import "../styles/Card_Normal.css";
import "../styles/Card_shiny_raycast.css";
import "../styles/Card_Rainbow.css";
import "../styles/Card_Radiant.css";
import "../styles/Card_Glittery";
interface CardProps {
    img: string;
    radius?: number | string;
    foil?: string;
    mask?: string;
    enableEffect?: boolean;
    data_set?: "Shiny" | "Shiny_raycast" | "Normal" | "Vibrant" | "Radiant" | "Glittery" | "Disable";
}
export declare function HoloCard({ img, radius, foil, mask, data_set, enableEffect, }: CardProps): React.JSX.Element;
export {};
