"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

export interface SMItem {
  label: string;
  link: string;
  ariaLabel?: string;
}

/* StaggeredMenu (React Bits) adaptado: panel controlado por el estado `open`
   del navbar (la hamburguesa de tres rayitas lo abre/cierra). Solo móvil. */
export default function StaggeredMenu({
  open,
  items,
  position = "right",
  colors = ["#e4dccc", "#5a8a38"],
  accentColor = "#5a8a38",
  onItemClick,
}: {
  open: boolean;
  items: SMItem[];
  position?: "left" | "right";
  colors?: string[];
  accentColor?: string;
  onItemClick?: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);
  const firstRun = useRef(true);

  /* estado inicial: panel y capas fuera de pantalla, ítems ocultos */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel) return;
      const preLayers = preContainer
        ? (Array.from(preContainer.querySelectorAll(".sm-prelayer")) as HTMLElement[])
        : [];
      preLayerElsRef.current = preLayers;
      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
      if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
      const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
      if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    });
    return () => ctx.revert();
  }, [position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));

    const offscreen = position === "left" ? -100 : 100;
    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });

    const tl = gsap.timeline({ paused: true });

    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
    });
    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: panelDuration, ease: "power4.out" }, panelInsertTime);

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: "power4.out", stagger: { each: 0.1, from: "start" } },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: "power2.out", "--sm-num-opacity": 1, stagger: { each: 0.08, from: "start" } },
          itemsStart + 0.1
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;
    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
        if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
        busyRef.current = false;
      },
    });
  }, [position]);

  /* abrir/cerrar según el prop `open` (evita disparar el cierre en el primer render) */
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (open) playOpen();
    else playClose();
  }, [open, playOpen, playClose]);

  const raw = colors && colors.length ? colors.slice(0, 3) : ["#e4dccc", "#5a8a38"];

  return (
    <div
      className="staggered-menu-wrapper fixed-wrapper md:hidden"
      style={{ ["--sm-accent" as string]: accentColor } as React.CSSProperties}
      data-position={position}
      data-open={open || undefined}
      aria-hidden={!open}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {raw.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />)}
      </div>
      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering>
            {items.map((it, idx) => (
              <li className="sm-panel-itemWrap" key={it.label + idx}>
                <a
                  className="sm-panel-item"
                  href={it.link}
                  aria-label={it.ariaLabel || it.label}
                  data-index={idx + 1}
                  onClick={() => onItemClick?.()}
                >
                  <span className="sm-panel-itemLabel">{it.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
