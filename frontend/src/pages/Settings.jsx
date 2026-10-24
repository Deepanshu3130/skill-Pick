import React from 'react';
import { useThemeStore } from "../store/useThemeStore";
import { Sun, Moon, Send, Check } from "lucide-react";
import HeadlineReveal from '../Components/motion/HeadlineReveal';

const Settings = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16">
      <div className="w-11/12 max-w-4xl mx-auto px-4 space-y-8 text-left">
        <div>
          <HeadlineReveal
            lines={["Interface Preferences"]}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content"
          />
          <p className="text-xs sm:text-sm text-base-content/70 mt-1">
            Choose between our high-contrast, WCAG AA compliant light and dark themes.
          </p>
        </div>

        {/* Theme Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Card */}
          <div
            onClick={() => setTheme("light")}
            className={`card bg-base-100 border p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
              theme === "light"
                ? "border-primary ring-2 ring-primary/20 shadow-sm"
                : "border-base-300 hover:border-base-content/30"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Sun className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-base-content">Developer Light</h3>
                  <p className="text-[11px] text-base-content/60">Clean slate canvas, deep indigo accents</p>
                </div>
              </div>

              {theme === "light" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-content">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Color Swatch Preview */}
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-slate-100 border border-slate-200">
              <div className="h-6 rounded-md bg-white border border-slate-200" title="Base surface" />
              <div className="h-6 rounded-md bg-indigo-600" title="Primary" />
              <div className="h-6 rounded-md bg-slate-700" title="Text" />
              <div className="h-6 rounded-md bg-emerald-600" title="Accent" />
            </div>
          </div>

          {/* Dark Theme Card */}
          <div
            onClick={() => setTheme("dark")}
            className={`card bg-base-100 border p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
              theme === "dark"
                ? "border-primary ring-2 ring-primary/20 shadow-sm"
                : "border-base-300 hover:border-base-content/30"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Moon className="size-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-base-content">Developer Dark</h3>
                  <p className="text-[11px] text-base-content/60">Low eye-strain dark slate, electric indigo</p>
                </div>
              </div>

              {theme === "dark" && (
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-content">
                  <Check className="size-3.5" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Color Swatch Preview */}
            <div className="grid grid-cols-4 gap-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="h-6 rounded-md bg-slate-950 border border-slate-800" title="Base surface" />
              <div className="h-6 rounded-md bg-indigo-500" title="Primary" />
              <div className="h-6 rounded-md bg-slate-200" title="Text" />
              <div className="h-6 rounded-md bg-emerald-400" title="Accent" />
            </div>
          </div>
        </div>

        {/* Live Preview Pane */}
        <div className="space-y-3 pt-4 border-t border-base-300">
          <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/70">
            Live Preview
          </h2>

          <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-sm">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-base-300 bg-base-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-mono font-bold">
                  JS
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-base-content">JavaScript Room</h4>
                  <p className="text-[10px] text-base-content/60 font-mono">14 peers active</p>
                </div>
              </div>
              <span className="badge badge-xs badge-success">Live</span>
            </div>

            {/* Chat Mock */}
            <div className="p-5 space-y-3.5 bg-base-100">
              <div className="chat chat-start">
                <div className="chat-image avatar">
                  <div className="w-7 h-7 rounded-full bg-base-300">
                    <img src="/avatar.png" alt="peer" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                </div>
                <div className="chat-header text-[10px] opacity-60 mb-0.5 font-mono">Alex • 10:42 AM</div>
                <div className="chat-bubble text-xs bg-base-200 text-base-content border border-base-300">
                  Does anyone have a clear explanation for JS event loop microtasks?
                </div>
              </div>

              <div className="chat chat-end">
                <div className="chat-header text-[10px] opacity-60 mb-0.5 font-mono">You • 10:43 AM</div>
                <div className="chat-bubble text-xs chat-bubble-primary">
                  Check out chapter 4 in the course playlist! Promises queue into microtasks right after the current execution context.
                </div>
              </div>
            </div>

            {/* Mock input */}
            <div className="p-3 border-t border-base-300 bg-base-200/50 flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Type a message..."
                className="input input-xs input-bordered flex-1 rounded-lg text-xs"
              />
              <button disabled className="btn btn-xs btn-primary btn-square rounded-lg">
                <Send className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
