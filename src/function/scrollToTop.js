// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // prevent browser from auto-restoring scroll on history navigation
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // if there's a hash (#id) try to scroll to that element
    if (hash) {
      // small timeout in case element renders after route change
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
        else window.scrollTo({ top: 0, left: 0 });
      }, 0);
    } else {
      // normal routes: go to top
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname, hash]);

  return null;
}
