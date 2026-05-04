"use client";

import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart2, Settings, Mail } from "lucide-react";

const Sidebar = () => {
  const links = [
    { to: "/", label: "Subjects", icon: Home },
    { to: "/stats", label: "Study Stats", icon: BarChart2 },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <aside
      className="w-64 hidden md:block"
      style={{
        backgroundColor: 'var(--clay-card)',
        borderRight: '3px solid var(--clay-dark)',
        boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.04), 4px 0 0 var(--clay-shadow)',
      }}
    >
      <div className="p-6">
        <nav className="flex flex-col gap-2">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-base transition-all duration-150 font-hand font-semibold ${
                    isActive ? '' : ''
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'var(--clay-accent)' : 'transparent',
                  color: isActive ? 'var(--paper)' : 'var(--ink-light)',
                  border: isActive ? '2px solid #7A3A1A' : '2px solid transparent',
                  boxShadow: isActive
                    ? 'inset 1px 1px 3px rgba(255,255,255,0.3), inset -1px -1px 3px rgba(0,0,0,0.15), 2px 3px 0px #7A3A1A'
                    : 'none',
                  fontSize: '17px',
                })}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'var(--clay-deep)',
                    border: '1.5px solid var(--clay-dark)',
                    boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)',
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {l.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
