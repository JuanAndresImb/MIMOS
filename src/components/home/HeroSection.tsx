import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section
      className="w-full pt-20 pb-24 md:pt-28 md:pb-32"
      style={{ backgroundColor: "var(--dahlia)" }}
      aria-labelledby="hero-heading"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[54fr_46fr] gap-16 md:gap-20 items-center">

          {/* Texte */}
          <div className="flex flex-col gap-8">
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl xl:text-6xl leading-[1.1]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--text-primary)" }}
            >
              {t("headline1")}{" "}
              <span style={{ color: "var(--text-secondary)" }}>{t("headline2")}</span>
              {" "}{t("headline3")}{" "}{t("headline4")}
            </h1>

            <p
              className="text-lg md:text-xl max-w-[30rem] leading-relaxed"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
            >
              {t("sousTitre")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/offrir/anniversaire"
                className="inline-flex items-center px-8 py-4 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{ backgroundColor: "var(--primary-500)", fontFamily: "var(--font-body)" }}
              >
                {t("ctaPrincipal")}
              </Link>
              <Link
                href="/comment-ca-marche"
                className="inline-flex items-center px-8 py-4 rounded-full font-semibold text-base transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-500)] focus-visible:ring-offset-2"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-body)" }}
              >
                {t("ctaSecondaire")}
              </Link>
            </div>

            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)", opacity: 0.7 }}
            >
              {t("trust1")} · {t("trust2")} · {t("trust3")}
            </p>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center">
            <div
              className="relative w-full max-w-[22rem] mx-auto rounded-3xl overflow-hidden"
              style={{ aspectRatio: "4/3", backgroundColor: "var(--chantilly)" }}
            >
              <Image
                src="/images/hero-placeholder.svg"
                alt="Douceur artisanale belge livrée en boîte aux lettres"
                fill
                priority
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
            <div
              className="absolute -bottom-3 -right-2 md:bottom-6 md:right-0 px-4 py-2 rounded-xl"
              style={{ backgroundColor: "var(--chantilly)", transform: "rotate(2deg)" }}
            >
              <span
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-handwriting)", color: "var(--primary-700)" }}
              >
                {t("badge")}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
