"use client";

import { useEffect, useRef } from "react";

export default function MimoJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cloud = cloudRef.current;
    const text = textRef.current;
    if (!section || !cloud || !text) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;
      // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
      const total = section.offsetHeight + windowH;
      const progress = Math.min(1, Math.max(0, (windowH - rect.top) / total));

      // Cloud travels from left edge (-8%) to right edge (108%)
      const x = progress * 116 - 8;
      cloud.style.transform = `translateX(${x}vw)`;

      // Gentle float bob
      const bob = Math.sin(progress * Math.PI * 4) * 6;
      cloud.style.marginTop = `${bob}px`;

      // Fade text in at midpoint
      const textOpacity = progress > 0.35 && progress < 0.85
        ? Math.min(1, (progress - 0.35) / 0.2) * Math.min(1, (0.85 - progress) / 0.1)
        : 0;
      text.style.opacity = String(textOpacity);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "200vh", backgroundColor: "var(--chantilly)" }}
      aria-label="MIMO voyage à travers la Belgique"
    >
      {/* Sticky container */}
      <div className="sticky top-0 w-full overflow-hidden" style={{ height: "100vh" }}>

        {/* Gradient sky */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--haze) 0%, var(--chantilly) 60%, var(--cantaloupe) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Ground strip */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "18%", backgroundColor: "var(--gumdrop)", opacity: 0.5 }}
          aria-hidden="true"
        />

        {/* Decorative dots — dotted path */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {[10, 22, 35, 48, 60, 72, 85].map((left, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${left}%`,
                top: `calc(42% + ${Math.sin(i) * 4}%)`,
                width: "6px",
                height: "6px",
                backgroundColor: "var(--primary-500)",
                opacity: 0.25,
              }}
            />
          ))}
        </div>

        {/* MIMO cloud SVG — travels left to right */}
        <div
          ref={cloudRef}
          className="absolute"
          style={{
            top: "36%",
            left: 0,
            width: "120px",
            transition: "margin-top 0.3s ease",
            willChange: "transform",
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cloud body */}
            <ellipse cx="60" cy="52" rx="48" ry="24" fill="white" />
            <circle cx="36" cy="44" r="20" fill="white" />
            <circle cx="60" cy="36" r="26" fill="white" />
            <circle cx="82" cy="42" r="18" fill="white" />
            {/* Shadow */}
            <ellipse cx="60" cy="75" rx="40" ry="5" fill="black" fillOpacity="0.06" />
            {/* Eyes */}
            <circle cx="52" cy="44" r="3.5" fill="#231510" />
            <circle cx="68" cy="44" r="3.5" fill="#231510" />
            <circle cx="53.5" cy="42.5" r="1.2" fill="white" />
            <circle cx="69.5" cy="42.5" r="1.2" fill="white" />
            {/* Smile */}
            <path d="M54 50 Q60 56 66 50" stroke="#231510" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Rosy cheeks */}
            <circle cx="46" cy="49" r="5" fill="#FAE7E8" fillOpacity="0.8" />
            <circle cx="74" cy="49" r="5" fill="#FAE7E8" fillOpacity="0.8" />
            {/* Carry handle — small box */}
            <rect x="48" y="64" width="24" height="12" rx="3" fill="var(--cantaloupe)" stroke="#B8874A" strokeWidth="1.5" />
            <path d="M54 64 V60 Q60 56 66 60 V64" stroke="#B8874A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        {/* Fade-in text */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center px-6"
          style={{ opacity: 0, transition: "opacity 0.4s ease", pointerEvents: "none" }}
        >
          <p
            className="text-xs uppercase tracking-[0.2em] mb-4"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
          >
            Comment ça marche ?
          </p>
          <h2
            className="text-3xl md:text-4xl xl:text-5xl leading-tight mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)", maxWidth: "42rem" }}
          >
            Tu choisis,{" "}
            <em style={{ color: "var(--dark)", fontStyle: "normal" }}>MIMO livre</em>
          </h2>
          <p
            className="text-base"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", maxWidth: "28rem" }}
          >
            Personnalise ta box, écris ton message. On emballe, on envoie directement dans la boîte aux lettres.
          </p>
        </div>
      </div>
    </section>
  );
}
