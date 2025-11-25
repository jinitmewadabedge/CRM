import React from "react";
import ContentLoader from "react-content-loader";

const MyLoader = ({
    width = "100%",
    rowHeight = 40,
    rowCount = 5,
    rowSpacing = 10,
    columnWidths = ["100%"]
}) => {
    
    const isDark = localStorage.getItem("darkModeModalShown") === "yes";

    const backgroundColor = isDark ? "#c5c3c3ff" : "#f3f3f3";

    return (
        <ContentLoader
            speed={2}
            width="100%"
            height={rowCount * (rowHeight + rowSpacing)}
            viewBox={`0 0 1200 ${rowCount * (rowHeight + rowSpacing)}`}
            backgroundColor={backgroundColor}
            preserveAspectRatio="none">
            {Array.from({ length: rowCount }).map((_, rowIndex) => {
                let xOffset = 0;
                return columnWidths.map((colWidth, colIndex) => {
                    const rect = (
                        <rect
                            key={`${rowIndex}-${colIndex}`}
                            x={xOffset}
                            y={rowIndex * (rowHeight + rowSpacing)}
                            rx="4"
                            ry="4"
                            width={colWidth}
                            height={rowHeight}
                        />
                    );
                    xOffset += parseInt(colWidth) + 5;
                    return rect;
                });
            })}
        </ContentLoader>
    );
};

export default MyLoader;
