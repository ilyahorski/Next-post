import {useEffect, useState} from "react";

export function useMobileCheck(initialIsMobile = false) {
  const [isMobile, setIsMobile] = useState(initialIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 940);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
