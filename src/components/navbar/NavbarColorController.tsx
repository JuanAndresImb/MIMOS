"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NavbarColorController() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const setSolid = () => {
      header.setAttribute("data-solid", "true");
      header.style.setProperty("--nav-text", "var(--text-primary)");
      header.style.setProperty("--nav-logo", "var(--primary-500)");
      header.style.setProperty("--nav-cta-bg", "var(--primary-500)");
      header.style.setProperty("--nav-cta-color", "white");
    };

    const setTransparent = () => {
      header.removeAttribute("data-solid");
      header.style.setProperty("--nav-text", "var(--text-primary)");
      header.style.setProperty("--nav-logo", "var(--primary-500)");
      header.style.setProperty("--nav-cta-bg", "var(--primary-500)");
      header.style.setProperty("--nav-cta-color", "white");
    };

    if (!isHome) {
      setSolid();
      return;
    }

    const onScroll = () => {
      if (window.scrollY > 60) setSolid();
      else setTransparent();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return null;
}
