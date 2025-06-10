import React, { useEffect, useRef, useState } from "react";
import {
    Canvas,
    DiffRect,
    rect,
    rrect,
    Path,
    Skia
} from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet } from "react-native";
import colors from "../styles/colors";

const { width, height } = Dimensions.get("window");
const scannerSize = 260;

export const Overlay = () => {
    // Use React state for scan line position
    const [scanLine, setScanLine] = useState(0);
    const animationRef = useRef();

    useEffect(() => {
        let start;
        const duration = 2000;

        function animate(ts) {
            if (!start) start = ts;
            const elapsed = (ts - start) % duration;
            setScanLine((elapsed / duration) * scannerSize);
            animationRef.current = requestAnimationFrame(animate);
        }
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    // Corners
    const cornerLength = 40;
    const cornerThickness = 4;
    const offset = 2;

    function cornerPath(x, y, dx, dy) {
        const path = Skia.Path.Make();
        path.moveTo(x, y + cornerThickness * dy);
        path.lineTo(x, y);
        path.lineTo(x + cornerLength * dx, y);
        path.lineTo(x + cornerLength * dx, y + cornerThickness * dy);
        path.lineTo(x + cornerThickness * dx, y + cornerThickness * dy);
        path.lineTo(x + cornerThickness * dx, y + cornerLength * dy);
        path.lineTo(x, y + cornerLength * dy);
        path.close();
        return path;
    }

    // Scanner rect
    const topLeft = { x: width / 2 - scannerSize / 2, y: height / 2 - scannerSize / 2 };
    const topRight = { x: width / 2 + scannerSize / 2, y: height / 2 - scannerSize / 2 };
    const bottomLeft = { x: width / 2 - scannerSize / 2, y: height / 2 + scannerSize / 2 };
    const bottomRight = { x: width / 2 + scannerSize / 2, y: height / 2 + scannerSize / 2 };

    const outer = rrect(rect(0, 0, width, height), 0, 0);
    const inner = rrect(
        rect(
            width / 2 - scannerSize / 2,
            height / 2 - scannerSize / 2,
            scannerSize,
            scannerSize
        ),
        8,
        8
    );

    // Scan line path
    const scanLineY = topLeft.y + scanLine;
    const scanLinePath = (() => {
        const path = Skia.Path.Make();
        path.moveTo(topLeft.x, scanLineY);
        path.lineTo(topRight.x, scanLineY);
        return path;
    })();

    return (
        <Canvas
            style={Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject}
        >
            <DiffRect inner={inner} outer={outer} color="rgba(0,0,0,0.6)" opacity={0.7} />

            {/* All four corners */}
            <Path
                path={cornerPath(topLeft.x - offset, topLeft.y - offset, 1, 1)}
                color={colors.scannerGuide}
                style="fill"
            />
            <Path
                path={cornerPath(topRight.x + offset, topRight.y - offset, -1, 1)}
                color={colors.scannerGuide}
                style="fill"
            />
            <Path
                path={cornerPath(bottomLeft.x - offset, bottomLeft.y + offset, 1, -1)}
                color={colors.scannerGuide}
                style="fill"
            />
            <Path
                path={cornerPath(bottomRight.x + offset, bottomRight.y + offset, -1, -1)}
                color={colors.scannerGuide}
                style="fill"
            />

            {/* Scan line */}
            <Path
                path={scanLinePath}
                color={colors.accent}
                style="stroke"
                strokeWidth={2}
            />
        </Canvas>
    );
};