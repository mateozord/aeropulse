import { useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Visão Geral" },
  { to: "/map", label: "Mapa" },
  { to: "/airports", label: "Aeroportos" },
  { to: "/war-room", label: "Sala de Operações" },
  { to: "/methodology", label: "Metodologia" },
  { to: "/about", label: "Sobre" },
];

export function Header({ live }: { live: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative border-b border-border bg-base/95 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="text-sm font-semibold tracking-[0.2em] text-foreground">
          AEROPULSE
        </NavLink>

        <nav className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-xs uppercase tracking-wider transition-colors ${
                  isActive ? "text-accent" : "text-muted hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 text-xs uppercase tracking-wider ${
              live ? "text-accent" : "text-attention"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${live ? "animate-breathe bg-accent" : "bg-attention"}`}
            />
            {live ? "Ao vivo" : "Dados simulados"}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            className="text-muted hover:text-foreground md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-border px-6 py-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `border-b border-border py-3 text-sm uppercase tracking-wider last:border-none ${
                  isActive ? "text-accent" : "text-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
