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
    <aside className="w-64 hidden md:block border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900">
      <div className="p-6">
        <nav className="flex flex-col gap-2">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20" : "text-slate-700 hover:bg-slate-50 dark:text-slate-300"
                  }`
                }
              >
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-slate-50 dark:bg-slate-800">
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
