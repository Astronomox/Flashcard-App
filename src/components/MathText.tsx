import React, { useRef, useEffect } from "react";

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, opts?: Record<string, unknown>) => string;
    };
  }
}

/**
 * Renders text that may contain LaTeX math expressions.
 * Supports both inline ($...$) and display ($$...$$) math.
 * Falls back to plain text if KaTeX isn't loaded.
 */
const MathText = ({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const renderMath = () => {
      if (!ref.current) return;
      const katex = window.katex;
      if (!katex) {
        // KaTeX not loaded yet, show plain text
        ref.current.textContent = text;
        return;
      }

      // Split on display math ($$...$$) and inline math ($...$)
      // Process display math first, then inline
      let html = text;

      // Replace display math $$...$$
      html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => {
        try {
          return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false });
        } catch {
          return _match;
        }
      });

      // Replace inline math $...$  (but not already processed $$)
      html = html.replace(/(?<!\$)\$(?!\$)(.*?)\$(?!\$)/g, (_match, tex) => {
        try {
          return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
        } catch {
          return _match;
        }
      });

      ref.current.innerHTML = html;
    };

    // If KaTeX is already loaded, render immediately
    if (window.katex) {
      renderMath();
    } else {
      // Wait for KaTeX to load
      const check = setInterval(() => {
        if (window.katex) {
          clearInterval(check);
          renderMath();
        }
      }, 100);
      // Timeout after 5 seconds, show plain text
      const timeout = setTimeout(() => {
        clearInterval(check);
        if (ref.current && !window.katex) {
          ref.current.textContent = text;
        }
      }, 5000);
      return () => {
        clearInterval(check);
        clearTimeout(timeout);
      };
    }
  }, [text]);

  return <div ref={ref} className={className} style={style} />;
};

export default MathText;
