import React, { useEffect, useState, useRef } from "react";
import { Sun, Moon, Home, BarChart2, Settings, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = ({ onSearch }: { onSearch?: (q: string) => void }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  return (
    <header
      className="w-full flex items-center justify-between py-3 px-4 sm:px-6 relative z-50"
      style={{
        backgroundColor: 'var(--clay-card)',
        borderBottom: '3px solid var(--clay-dark)',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.06), 0 4px 0 var(--clay-shadow)',
      }}
    >
      <div
        className="text-xl sm:text-2xl font-bold font-display"
        style={{ color: 'var(--ink)' }}
      >
        Astronomox
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="hidden sm:block font-hand font-semibold"
          style={{ color: 'var(--ink-faint)', fontSize: '15px' }}
        >
          ~ study smarter ~
        </div>
        <button
          onClick={toggleTheme}
          style={{
            padding: '7px 10px',
            borderRadius: '10px',
            border: '2px solid var(--clay-dark)',
            background: 'var(--clay-deep)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3), inset -1px -1px 2px rgba(0,0,0,0.1), 2px 3px 0px var(--clay-dark)',
          }}
        >
          {isDark ? <Sun className="w-4 h-4" style={{ color: 'var(--highlight)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--ink-light)' }} />}
        </button>
        <MobileMenu />
      </div>
    </header>
  );
};

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="md:hidden relative" ref={menuRef}>
      <button
        aria-label={open ? "Close menu" : "Open menu"}
        className="w-10 h-10 flex items-center justify-center rounded-lg"
        style={{
          background: open ? 'var(--clay-accent)' : 'var(--clay-deep)',
          border: '2px solid var(--clay-dark)',
          boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3), 2px 3px 0px var(--clay-dark)',
          cursor: 'pointer',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--paper)' }}>
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ color: 'var(--ink)' }}>
            <path d="M2 2H18M2 8H18M2 14H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-52 rounded-xl z-50"
          style={{
            background: 'var(--clay-card)',
            border: '3px solid var(--clay-dark)',
            boxShadow: '4px 6px 0px var(--clay-shadow), 6px 8px 0px rgba(0,0,0,0.05)',
            padding: '8px',
          }}
        >
          <nav className="flex flex-col gap-1">
            {[
              { to: "/", label: "Subjects", icon: Home },
              { to: "/stats", label: "Study Stats", icon: BarChart2 },
              { to: "/settings", label: "Settings", icon: Settings },
              { to: "/contact", label: "Contact", icon: Mail },
            ].map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className="flex items-center gap-3 font-hand font-semibold rounded-lg px-3 py-2.5"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--paper)' : 'var(--ink-light)',
                  fontSize: '17px',
                  background: isActive ? 'var(--clay-accent)' : 'transparent',
                  border: isActive ? '2px solid #7A3A1A' : '2px solid transparent',
                })}
                onClick={() => setOpen(false)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;