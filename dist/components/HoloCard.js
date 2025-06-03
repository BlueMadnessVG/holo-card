var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useRef, useState } from "react";
import { useHolographicEffect } from "../hooks/useHolographicEffect";
import { animated } from "@react-spring/web";
import "../styles/Card.css";
import "../styles/Card_shiny.css";
import "../styles/Card_Normal.css";
import "../styles/Card_shiny_raycast.css";
import "../styles/Card_Rainbow.css";
import "../styles/Card_Radiant.css";
import "../styles/Card_Glittery";
export function HoloCard(_a) {
    var img = _a.img, radius = _a.radius, _b = _a.foil, foil = _b === void 0 ? "" : _b, _c = _a.mask, mask = _c === void 0 ? "" : _c, _d = _a.data_set, data_set = _d === void 0 ? "Normal" : _d, _e = _a.enableEffect, enableEffect = _e === void 0 ? true : _e;
    var cardRef = useRef(null);
    var randomSeed = useState({ x: Math.random(), y: Math.random() })[0];
    var cosmosPosition = useState({
        x: Math.floor(randomSeed.x * 734),
        y: Math.floor(randomSeed.y * 1280),
    })[0];
    var _f = useState(""), frontImg = _f[0], setFrontImg = _f[1];
    var _g = useState({}), foilStyles = _g[0], setFoilStyles = _g[1];
    var _h = useHolographicEffect(false), isMobile = _h.isMobile, isActive = _h.isActive, isInteracting = _h.isInteracting, isLoading = _h.isLoading, setIsActive = _h.setIsActive, setIsLoading = _h.setIsLoading, handleInteract = _h.handleInteract, handleInteractEnd = _h.handleInteractEnd, retreat = _h.retreat, springStyle = _h.springStyle;
    var handleImageLoad = function () {
        setIsLoading(false);
        if (mask || foil) {
            setFoilStyles({
                "--mask": "url(".concat(mask, ")"),
                "--foil": "url(".concat(foil, ")"),
            });
        }
    };
    var staticStyles = {
        "--seedx": randomSeed.x,
        "--seedy": randomSeed.y,
        "--cosmosbg": "".concat(cosmosPosition.x, "px ").concat(cosmosPosition.y, "px"),
    };
    var combinedStyles = __assign(__assign({}, staticStyles), foilStyles);
    var handleActive = function () {
        setIsActive(!isActive);
    };
    var cardClasses = [
        "card",
        "interactive",
        isActive ? "active" : "",
        isInteracting ? "interacting" : "",
        mask ? "masked" : "",
    ]
        .filter(Boolean)
        .join(" ");
    return (React.createElement(animated.div, { ref: cardRef, className: cardClasses, style: __assign(__assign({}, springStyle), (radius !== undefined && {
            "--card-radius": typeof radius === "number" ? "".concat(radius, "px") : radius,
        })), "data-set": data_set },
        React.createElement("div", { className: "card_translater" },
            React.createElement(animated.button, { className: "card_rotator", onClick: handleActive, onMouseMove: enableEffect ? handleInteract : undefined, onMouseLeave: enableEffect ? function () { return handleInteractEnd(); } : undefined, "aria-label": "Interactive card", tabIndex: 0 },
                React.createElement("div", { className: "card_front", style: combinedStyles },
                    React.createElement("img", { src: img, alt: "Pokemon", onLoad: handleImageLoad, loading: "lazy" }),
                    React.createElement("div", { className: "card_shine" }),
                    React.createElement("div", { className: "card_glare" }))))));
}
