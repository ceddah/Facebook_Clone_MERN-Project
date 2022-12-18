import { useEffect } from "react";

export default function useClickOutside(ref, callback) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      callback();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchStart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchStart", listener);
    };
  }, [ref]);
}
