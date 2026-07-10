"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface DropdownItem {
  label: string;
  desc?: string;
  href: string;
  badge?: string;
}

interface NavDropdownProps {
  trigger: string;
  items: DropdownItem[];
  footerLabel?: string;
  footerHref?: string;
}

export default function NavDropdown({ trigger, items, footerLabel, footerHref }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {/* Trigger */}
      <button className="text-on-surface-variant hover:text-primary-container transition-colors duration-300 font-label uppercase tracking-widest text-xs md:text-sm cursor-pointer bg-transparent border-none outline-none">
        {trigger}
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50 transition-all duration-200 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="min-w-[320px] rounded-2xl border border-white/10 bg-surface/90 backdrop-blur-2xl shadow-2xl shadow-black/30 p-2">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors duration-150 group"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-on-surface group-hover:text-primary-container transition-colors">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-primary-container font-label text-[10px] uppercase tracking-widest font-bold">{item.badge}</span>
                )}
              </div>
              {item.desc && (
                <span className="font-body text-xs text-on-surface-variant/70 leading-relaxed">{item.desc}</span>
              )}
            </Link>
          ))}

          {footerLabel && footerHref && (
            <>
              <div className="h-px bg-white/10 mx-3 my-1" />
              <Link
                href={footerHref}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <span className="font-label text-xs uppercase tracking-widest font-bold text-primary-container">
                  {footerLabel}
                </span>
                <span className="text-primary-container text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
