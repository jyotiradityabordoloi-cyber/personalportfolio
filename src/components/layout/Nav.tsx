"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import clsx from "clsx";
import { nav, site } from "@/content/site";

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    if (!enabled) return;
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting);
        if (vis.length) setActive(vis[0].target.id);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

/*
  The bar sits on the light hero and on the black sections, so it is drawn in
  white with mix-blend-mode: difference: black over paper, white over black.
*/
export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const scrollActive = useActiveSection(isHome);
  const routeActive = pathname.split("/")[1] || "home";
  const active = isHome ? scrollActive : routeActive;
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const href = (id: string) => `/#${id}`;
  const links = nav.filter((n) => n.id !== "home");

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <motion.div aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-white" style={{ scaleX: progress }} />
        <nav className="container-x pointer-events-auto flex h-16 items-center justify-between gap-6 md:h-20" aria-label="Primary">
          <Link href="/#home" className="group text-[15px] font-medium tracking-tight" aria-label={`${site.name}, home`}>
            {site.name}
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <Link
                    href={href(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx("block py-2 text-[13px] transition-opacity", isActive ? "opacity-100" : "opacity-60 hover:opacity-100")}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-white"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <button
            className="flex h-11 items-center gap-2 text-[13px] lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
            <span className="flex w-5 flex-col gap-1.5" aria-hidden>
              <span className={clsx("h-px bg-white transition-transform", open && "translate-y-[3.5px] rotate-45")} />
              <span className={clsx("h-px bg-white transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black pt-24 lg:hidden"
          >
            <ul className="container-x grid gap-1">
              {nav.map((item, i) => (
                <motion.li key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <Link
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-line py-4 font-display text-3xl font-bold uppercase tracking-tight"
                  >
                    {item.label}
                    <span className="font-mono text-xs font-normal text-faint">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
