"use client";

import "./StaggeredMenu.css";

export interface SMItem {
  label: string;
  link: string;
  ariaLabel?: string;
}

/* StaggeredMenu (inspirado en React Bits) con transiciones CSS puras: robusto y
   controlado por el estado `open` del navbar (la hamburguesa lo abre/cierra). Solo móvil. */
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
  const layers = (colors && colors.length ? colors : ["#e4dccc", "#5a8a38"]).slice(0, 3);

  return (
    <div
      className="staggered-menu-wrapper fixed-wrapper md:hidden"
      style={{ ["--sm-accent"]: accentColor } as React.CSSProperties}
      data-position={position}
      data-open={open || undefined}
      aria-hidden={!open}
    >
      <div className="sm-prelayers" aria-hidden="true">
        {layers.map((c, i) => (
          <div
            key={i}
            className="sm-prelayer"
            style={{ background: c, transitionDelay: open ? `${i * 0.07}s` : `${(layers.length - 1 - i) * 0.04}s` }}
          />
        ))}
      </div>
      <aside id="staggered-menu-panel" className="staggered-menu-panel" aria-hidden={!open}>
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
                  <span
                    className="sm-panel-itemLabel"
                    style={{ transitionDelay: open ? `${0.18 + idx * 0.07}s` : "0s" }}
                  >
                    {it.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
