import { useCallback, useEffect, useState } from "react";

function useDimensions() {
  const [width, setWidth] = useState(1300);
  const [height, setHeight] = useState(0);

  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
  }, []);

  useEffect(() => {
    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("load", handleResize);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleResize);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [handleResize]);

  return { width, height };
}

export default useDimensions;
