import { useState, useEffect } from "react";

const useOutsideClick = (
  initialIsVisible: boolean,
  ref: React.RefObject<HTMLElement>,
  onOutsideClick: () => void
) => {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
      if (onOutsideClick) {
        onOutsideClick();
      }
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside, true);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("click", handleClickOutside, true);
      }
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
};

export default useOutsideClick;
