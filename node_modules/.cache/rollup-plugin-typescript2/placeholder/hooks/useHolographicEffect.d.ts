import React from "react";
export declare function useHolographicEffect(_showcase?: boolean): {
    isMobile: boolean;
    isActive: boolean;
    isInteracting: boolean;
    isLoading: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    handleInteract: (e: React.MouseEvent) => void;
    handleInteractEnd: (delay?: number) => void;
    retreat: () => void;
    springStyle: React.CSSProperties & {
        [key: string]: any;
    };
};
