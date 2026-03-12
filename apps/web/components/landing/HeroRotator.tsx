"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ScanLine, Github } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

const SLIDE_DURATION = 3800;
const FADE_DURATION  = 380;

export function HeroRotator() {
  const t  = useTranslations("home");
  const tc = useTranslations("common");

  const slides = [
    { tag: t("heroSlide0Tag"), t1: t("heroSlide0T1"), t2: t("heroSlide0T2"), desc: t("heroSlide0Desc"), ready: true  },
    { tag: t("heroSlide1Tag"), t1: t("heroSlide1T1"), t2: t("heroSlide1T2"), desc: t("heroSlide1Desc"), ready: false },
    { tag: t("heroSlide2Tag"), t1: t("heroSlide2T1"), t2: t("heroSlide2T2"), desc: t("heroSlide2Desc"), ready: false },
    { tag: t("heroSlide3Tag"), t1: t("heroSlide3T1"), t2: t("heroSlide3T2"), desc: t("heroSlide3Desc"), ready: false },
  ];

  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => {
      setIndex(next);
      setVisible(true);
    }, FADE_DURATION);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((index + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [index, goTo, slides.length]);

  const slide = slides[index];

  return (
    <section className="flex flex-col items-center text-center px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-20 gap-6">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
        {t("badge")}
      </div>

      {/* Animated content */}
      <div
        className="flex flex-col items-center gap-3 max-w-2xl"
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "translateY(0)" : "translateY(6px)",
          transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
        }}
      >
        {/* Scan type tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-primary">{slide.tag}</span>
          {!slide.ready && (
            <span className="text-[10px] font-medium border border-border/60 text-muted-foreground rounded px-1.5 py-0.5 bg-muted/40">
              {tc("soon")}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]">
          {slide.t1}{" "}
          <span>{slide.t2}</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
          {slide.desc}
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
          <Link href="/analyze">
            <ScanLine className="h-4 w-4" />
            {t("ctaPrimary")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
          <a href="https://github.com/diogopaesdev/crawsecure" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" />
            {t("ctaGitHub")}
          </a>
        </Button>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => i !== index && goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className="flex items-center py-1"
          >
            <span
              className="block h-1 rounded-full transition-all duration-300"
              style={{
                width:           i === index ? 24 : 6,
                backgroundColor: i === index ? "hsl(var(--foreground))" : "hsl(var(--border))",
              }}
            />
          </button>
        ))}
      </div>

    </section>
  );
}
