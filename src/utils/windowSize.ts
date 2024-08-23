import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return width;
};

const useIsMobile = () => {
  const width = useWindowSize();
  return width <= 768;
};

export default useIsMobile;
