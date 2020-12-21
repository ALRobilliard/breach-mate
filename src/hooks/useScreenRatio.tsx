import { useState, useCallback } from "react";

export function useScreenRatio(initialRatio: number) {
    const [aspectRatio, setAspectRatio] = useState(initialRatio);

    const calculateRatio = useCallback((height, width) => {
        if (height && width) {
            const isLandscape = height <= width;
            const ratio = isLandscape ? width / height : height / width;

            setAspectRatio(ratio);
        }
    }, []);

    return [setAspectRatio, calculateRatio];
}