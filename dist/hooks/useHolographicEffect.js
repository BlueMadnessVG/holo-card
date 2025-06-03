import { to, useSpring } from "@react-spring/web";
import { useEffect, useState, } from "react";
import { adjust, clamp, round } from "../helpers/Math";
export function useHolographicEffect(showcase) {
    if (showcase === void 0) { showcase = false; }
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
