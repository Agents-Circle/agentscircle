import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A slow halftone field: a grid of dots whose size follows two drifting glows.
 * It is the page's "chill" background — calm, dark, always moving a little.
 */
export function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const gap = 10;
    let visible = true;
    const vis = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    vis.observe(canvas);
    let last = 0;
    function draw(t: number) {
      raf = 0;
      if (!visible) return;
      // 30 fps is plenty for a slow drift, and halves the cost.
      if (t - last < 33 && !reducedMotion()) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = t;
      ctx!.clearRect(0, 0, w, h);
      const s = t / 1000;
      const g1x = w * (0.5 + 0.28 * Math.sin(s * 0.07));
      const g1y = h * (0.85 + 0.08 * Math.cos(s * 0.09));
      const g2x = w * (0.2 + 0.18 * Math.cos(s * 0.05));
      const g2y = h * (0.35 + 0.12 * Math.sin(s * 0.06));
      const r1 = Math.max(w, h) * 0.55;
      const r2 = Math.max(w, h) * 0.32;
      // Square dots in a few alpha buckets: one fillStyle change per bucket, no arcs.
      const buckets: number[][] = [[], [], [], [], []];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx1 = (x - g1x) / r1;
          const dy1 = ((y - g1y) * 1.6) / r1;
          const d1 = dx1 * dx1 + dy1 * dy1;
          const dx2 = (x - g2x) / r2;
          const dy2 = (y - g2y) / r2;
          const d2 = dx2 * dx2 + dy2 * dy2;
          if (d1 > 1 && d2 > 1) continue;
          const wave = 0.5 + 0.5 * Math.sin(x * 0.012 + y * 0.008 + s * 0.6);
          const v = Math.max(0, 1 - Math.sqrt(d1)) * 0.9 + Math.max(0, 1 - Math.sqrt(d2)) * 0.45 * wave;
          if (v < 0.05) continue;
          buckets[Math.min(4, Math.floor(v * 5))].push(x, y, Math.min(3.2, 0.8 + v * 2.6));
        }
      }
      for (let k = 0; k < buckets.length; k++) {
        const v = (k + 0.5) / 5;
        ctx!.fillStyle = `rgba(${Math.round(120 + 100 * v)}, ${Math.round(170 + 60 * v)}, 255, ${(0.15 + v * 0.7).toFixed(2)})`;
        const arr = buckets[k];
        for (let i = 0; i < arr.length; i += 3) {
          const r = arr[i + 2];
          ctx!.fillRect(arr[i] - r / 2, arr[i + 1] - r / 2, r, r);
        }
      }
      if (!reducedMotion()) raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      vis.disconnect();
    };
  }, []);
  return <canvas ref={ref} className={`dot-field ${className}`} aria-hidden="true" />;
}

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setShown(true);
      return;
    }
    // IntersectionObserver alone can miss an element that crosses the viewport between two
    // frames on a busy page, so a cheap scroll check backs it up.
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      setShown(true);
      io.disconnect();
      window.removeEventListener("scroll", check);
    };
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) show();
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && show(), { threshold: 0.1 });
    io.observe(el);
    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", check);
    };
  }, []);
  const style = { transitionDelay: `${delay}ms` } as CSSProperties;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${shown ? "in" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/** Counts up to `value` once visible. */
export function Counter({ value, format }: { value: number; format: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(reducedMotion() ? value : 0);
  const target = useRef(value);
  target.current = value;
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) {
      setShown(value);
      return;
    }
    let raf = 0;
    let started = false;
    const from = shown;
    const run = () => {
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        const e = 1 - Math.pow(1 - k, 4);
        setShown(from + (target.current - from) * e);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        run();
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span ref={ref} className="tabular">
      {format(shown)}
    </span>
  );
}

/** Tilts its child toward the pointer, a few degrees at most. */
export function Tilt({ children, max = 8, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const onMove = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [max]);
  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}
