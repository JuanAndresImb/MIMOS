"use client";

import { useEffect, useState } from "react";

export default function NavbarScrollBg() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 transition-all duration-300 border-b"
      style={{
        backgroundColor: scrolled ? "rgba(255,253,254,0.96)" : "transparent",
        borderBottomColor: scrolled ? "rgba(35,27,46,0.08)" : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
      }}
    />
  );
}
