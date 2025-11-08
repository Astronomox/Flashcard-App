import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Menu, Home, BarChart2, Settings, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = ({ onSearch }: { onSearch?: (q: string) => void }) => {
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(document.documentElement.classList.contains("dark"));
  };

  return (
    <header className="w-full flex items-center justify-between py-4 px-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-slate-900 dark:text-white">Academic Flashcards</div>
        <div className="text-sm text-gray-500 dark:text-gray-300">Study smarter, not harder</div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={toggleTheme} className="p-2">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        {/* Mobile-only hamburger menu (replaces profile icon). Visible on small screens only. */}
        <MobileMenu />
      </div>
    </header>
  );
};

const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="md:hidden relative">
      <button
        aria-label="Open menu"
        className="w-10 h-10 flex items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800"
        onClick={() => setOpen((v) => !v)}
      >
        <div className={`w-6 h-6 relative`}> 
          <span className={`block absolute h-0.5 w-6 bg-current left-0 transform transition duration-300 ${open ? 'rotate-45 top-2.5' : 'top-1'}`}></span>
          <span className={`block absolute h-0.5 w-6 bg-current left-0 transform transition duration-300 ${open ? 'opacity-0' : 'top-2.5'}`}></span>
          <span className={`block absolute h-0.5 w-6 bg-current left-0 transform transition duration-300 ${open ? '-rotate-45 top-2.5' : 'top-4'}`}></span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-md shadow-lg z-50">
          <nav className="flex flex-col">
            <NavLink 
              to="/" 
              className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Home className="w-4 h-4" />
              <span>Subjects</span>
            </NavLink>
            <NavLink 
              to="/stats" 
              className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Study Stats</span>
            </NavLink>
            <NavLink 
              to="/settings" 
              className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </NavLink>
            <NavLink 
              to="/contact" 
              className="px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;