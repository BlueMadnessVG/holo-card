import React, { useState, useEffect, useRef } from 'react';
import { useSpring, to, animated } from '@react-spring/web';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// * return a value that has been rounded to a set precision
var round = function (value, precision) {
    if (precision === void 0) { precision = 3; }
    return parseFloat(value.toFixed(precision));
};
//  *Return a value that has been limited between min & max
var clamp = function (value, min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 100; }
    return Math.min(Math.max(value, min), max);
};
// * return a value that has been re-mapped according to the from/to
var adjust = function (value, fromMin, fromMax, toMin, toMax) {
    return round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
};

function useHolographicEffect(_showcase) {
    var _a = useState(false), isMobile = _a[0], setIsMobile = _a[1];
    var _b = useState(false), isActive = _b[0], setIsActive = _b[1];
    var _c = useState(false), isInteracting = _c[0], setIsInteracting = _c[1];
    var _d = useState(true), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState(true), isVisible = _e[0], setIsVisible = _e[1];
    var springInteractSetting = {
        stiffness: 0.066,
        damping: 0.25,
    };
    var springPopoverSetting = {
        stiffness: 0.033,
        damping: 0.45,
    };
    var _f = useSpring(function () { return ({
        from: { x: 0, y: 0 },
        config: springInteractSetting,
    }); }), springRotate = _f[0], setSpringRotate = _f[1];
    var _g = useSpring(function () { return ({
        from: { x: 50, y: 50, o: 0 },
        config: springInteractSetting,
    }); }), springGlare = _g[0], setSpringGlare = _g[1];
    var _h = useSpring(function () { return ({
        x: 50,
        y: 50,
        config: springInteractSetting,
    }); }), springBackground = _h[0], setSpringBackground = _h[1];
    var _j = useSpring(function () { return ({
        x: 0,
        y: 0,
        config: springPopoverSetting,
    }); }), springRotateDelta = _j[0], setSpringRotateDelta = _j[1];
    var updateSprings = function (background, rotate, glare) {
        setSpringBackground(background);
        setSpringRotate(rotate);
        setSpringGlare(glare);
    };
    var handleInteract = function (e) {
        if (!isVisible || isMobile)
            return;
        setIsInteracting(true);
        var clientX = e.clientX;
        var clientY = e.clientY;
        var target = e.currentTarget;
        var rect = target.getBoundingClientRect();
        var absolute = {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
        var percent = {
            x: clamp(round((100 / rect.width) * absolute.x)),
            y: clamp(round((100 / rect.height) * absolute.y)),
        };
        var center = {
            x: percent.x - 50,
            y: percent.y - 50,
        };
        updateSprings({
            x: adjust(percent.x, 0, 100, 37, 63),
            y: adjust(percent.y, 0, 100, 33, 67),
        }, {
            x: round(-(center.x / 3.5)),
            y: round(center.y / 2),
        }, {
            x: round(percent.x),
            y: round(percent.y),
            o: 1,
        });
    };
    var handleInteractEnd = function (delay) {
        if (delay === void 0) { delay = 500; }
        setTimeout(function () {
            var snapSetting = { stiffness: 0.01, damping: 0.06 };
            setIsInteracting(false);
            setSpringRotate({ x: 0, y: 0, config: snapSetting });
            setSpringGlare({ x: 50, y: 50, o: 0, config: snapSetting });
            setSpringBackground({ x: 50, y: 50, config: snapSetting });
        }, delay);
    };
    var retreat = function () {
        setSpringRotateDelta({ x: 0, y: 0 });
        handleInteractEnd(100);
    };
    useEffect(function () {
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
        setIsVisible(document.visibilityState === "visible");
        var handleVisibilityChange = function () {
            setIsVisible(document.visibilityState === "visible");
            retreat();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return function () {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    var springStyle = {
        "--pointer-x": to(springGlare.x, function (x) { return "".concat(x, "%"); }),
        "--pointer-y": to(springGlare.y, function (y) { return "".concat(y, "%"); }),
        "--pointer-from-center": to([springGlare.x, springGlare.y], function (x, y) {
            return clamp(Math.sqrt(Math.pow((y - 50), 2) + Math.pow((x - 50), 2)) / 50, 0, 1);
        }),
        "--pointer-from-top": to(springGlare.y, function (y) { return y / 100; }),
        "--pointer-from-left": to(springGlare.x, function (x) { return x / 100; }),
        "--card-opacity": springGlare.o,
        "--rotate-x": to([springRotate.x, springRotateDelta.x], function (x, dx) { return "".concat(x + dx, "deg"); }),
        "--rotate-y": to([springRotate.y, springRotateDelta.y], function (y, dy) { return "".concat(y + dy, "deg"); }),
        "--background-x": to(springBackground.x, function (x) { return "".concat(x, "%"); }),
        "--background-y": to(springBackground.y, function (y) { return "".concat(y, "%"); }),
    };
    return {
        isMobile: isMobile,
        isActive: isActive,
        isInteracting: isInteracting,
        isLoading: isLoading,
        setIsActive: setIsActive,
        setIsLoading: setIsLoading,
        handleInteract: handleInteract,
        handleInteractEnd: handleInteractEnd,
        retreat: retreat,
        springStyle: springStyle,
    };
}

function HoloCard(_a) {
    var img = _a.img, radius = _a.radius, _b = _a.foil, foil = _b === void 0 ? "" : _b, _c = _a.mask, mask = _c === void 0 ? "" : _c, _d = _a.data_set, data_set = _d === void 0 ? "Normal" : _d, _e = _a.enableEffect, enableEffect = _e === void 0 ? true : _e;
    var cardRef = useRef(null);
    var randomSeed = useState({ x: Math.random(), y: Math.random() })[0];
    var cosmosPosition = useState({
        x: Math.floor(randomSeed.x * 734),
        y: Math.floor(randomSeed.y * 1280),
    })[0];
    var _f = useState({}), foilStyles = _f[0], setFoilStyles = _f[1];
    var _g = useHolographicEffect(), isActive = _g.isActive, isInteracting = _g.isInteracting, setIsActive = _g.setIsActive, setIsLoading = _g.setIsLoading, handleInteract = _g.handleInteract, handleInteractEnd = _g.handleInteractEnd, springStyle = _g.springStyle;
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
                    React.createElement("img", { src: img, alt: "img alt", onLoad: handleImageLoad, loading: "lazy" }),
                    React.createElement("div", { className: "card_shine" }),
                    React.createElement("div", { className: "card_glare" }))))));
}

export { HoloCard };
//# sourceMappingURL=index.esm.js.map
