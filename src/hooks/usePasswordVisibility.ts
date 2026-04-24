import { useCallback, useState } from "react";

// This hook manages the visibility state of password inputs

export function usePasswordVisibility(defaultVisible = false) {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  const inputType: "text" | "password" = isVisible ? "text" : "password";
  const ariaLabel = isVisible ? "Hide password" : "Show password";

  return {
    isVisible,
    inputType,
    ariaLabel,
    toggleVisibility,
  };
}
