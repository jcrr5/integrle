import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Layout({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('integrle-dark') === 'true';
    }
    return false;
  });

useEffect(() => {
  document.documentElement.classList.toggle('dark', dark);
  // Convert the boolean 'dark' to a string
  localStorage.setItem('integrle-dark', dark.toString()); 
}, [dark]);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-[#FAF6F0] dark:bg-[#141425] text-[#2a2a2a] dark:text-[#e8e8e8]">
      <style>{`
        :root {
          --color-primary: #A8D5BA;
          --color-primary-dark: #5B9E7A;
          --color-bg: #FAF6F0;
          --color-bg-dark: #141425;
        }
        * { -webkit-tap-highlight-color: transparent; }
        body {
          background-color: #FAF6F0;
          transition: background-color 0.3s;
        }
        .dark body, html.dark body {
          background-color: #141425;
        }
      `}</style>

      {/* Dark mode toggle - floating */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center
          bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-lg
          border border-[#A8D5BA]/20 hover:border-[#A8D5BA]/40
          transition-all duration-300 hover:scale-105"
        aria-label="Toggle dark mode"
      >
        {dark ? (
          <Sun className="w-4.5 h-4.5 text-[#A8D5BA]" />
        ) : (
          <Moon className="w-4.5 h-4.5 text-[#5B9E7A]" />
        )}
      </button>

      {children}
    </div>
  );
}