import { useState, useEffect } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState<number | null>(null); // Start with null

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth); // Set width once window is available

      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return width;
}

export default useWindowWidth;
