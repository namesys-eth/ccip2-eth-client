import React, { useState, useEffect } from "react";

interface Props {
  height: number,
  width: number
}

const FlapLoadingIcon: React.FC<Props> = ({ height, width }) => {
  const [flapStatus, setFlapStatus] = useState<Array<boolean>>([true, true, true, true]);

  useEffect(() => {
    const flapInterval = setInterval(() => {
      setFlapStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        const indexOfFalse = newStatus.indexOf(false);
        newStatus[indexOfFalse] = true;
        newStatus[(indexOfFalse + 1) % newStatus.length] = false;
        return newStatus;
      });
    }, 400);
  
    return () => clearInterval(flapInterval);
  }, []);

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="30 0 130 337" width="${width}mm" height="${height}mm">
      <path
        d="M -29.308975,325.1522 1.8828298,142.92643 33.074634,263.31583 Z"
        style="fill: #ff6400; stroke: none; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 4; stroke-dasharray: none;"
        opacity="${flapStatus[0] ? 1 : 0}"
      />
      <path
        d="M 15.01621,128.15136 46.208014,249.63522 218.58375,77.806709 Z"
        style="fill: #ff6400; stroke: none; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 4; stroke-dasharray: none;"
        opacity="${flapStatus[1] ? 1 : 0}"
      />
      <path
        d="M -18.911707,335.54949 153.46403,163.17373 185.20306,285.75203 Z"
        style="fill: #ff6400; stroke: none; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 4; stroke-dasharray: none;"
        opacity="${flapStatus[3] ? 1 : 0}"
      />
      <path
        d="M 166.05021,150.58758 228.98104,88.203976 197.78924,272.07141 Z"
        style="fill: #ff6400; stroke: none; stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 4; stroke-dasharray: none;"
        opacity="${flapStatus[2] ? 1 : 0}"
      />
    </svg>
  `;
  
  return <div dangerouslySetInnerHTML={{ __html: svgString }} />;
};

export default FlapLoadingIcon;
