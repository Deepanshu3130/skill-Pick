import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Youtube, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full border-t border-base-300 bg-base-100/90 pt-12 pb-8 mt-auto">
      <div className="w-11/12 max-w-7xl mx-auto px-4">
        
        {/* Main Grid: Brand + Platforms + Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-base-300/80 text-left">
          
          {/* Brand Info (Cols 1-6) */}
          <div className="md:col-span-6 space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img 
                src="/logo.png" 
                alt="SkillPick Logo" 
                className="w-6 h-6 rounded-md object-contain shrink-0" 
              />
              <span className="font-bold text-base text-base-content tracking-tight">
                Skill<span className="text-primary">Pick</span>
              </span>
            </Link>

            <p className="text-xs text-base-content/70 max-w-md leading-relaxed">
              An open, student-driven platform for discovering verified YouTube courses, starred GitHub repositories, and collaborative study rooms. Learn, discuss doubts, and build together.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-base-content/50 font-mono">
              <ShieldCheck className="size-3.5 text-success shrink-0" />
              <span>Official YouTube Data API v3 & GitHub REST API. Zero web scraping.</span>
            </div>
          </div>

          {/* Platforms / Learning Sources Column (Cols 7-9) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/80 font-mono">
              Platforms
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link 
                  to="/Platform/YouTube" 
                  className="group flex items-center gap-2 text-base-content/75 hover:text-primary transition-colors"
                >
                  <Youtube className="size-3.5 text-primary/80 group-hover:text-primary transition-colors" />
                  <span>YouTube Courses</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/Platform/GitHub" 
                  className="group flex items-center gap-2 text-base-content/75 hover:text-primary transition-colors"
                >
                  <Github className="size-3.5 text-primary/80 group-hover:text-primary transition-colors" />
                  <span>GitHub Repositories</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/Platform/Community" 
                  className="group flex items-center gap-2 text-base-content/75 hover:text-primary transition-colors"
                >
                  <MessageSquare className="size-3.5 text-primary/80 group-hover:text-primary transition-colors" />
                  <span>Community Submissions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation & Contact Column (Cols 10-12) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/80 font-mono">
              Navigation & Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-base-content/75 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/aboutUs" className="text-base-content/75 hover:text-primary transition-colors">
                  About SkillPick
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-base-content/75 hover:text-primary transition-colors">
                  Settings & Themes
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-base-content/75 hover:text-primary transition-colors"
                >
                  <Github className="size-3.5" />
                  <span>Source on GitHub</span>
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-base-content/60">
          <p>© {new Date().getFullYear()} SkillPick. Built for student developers.</p>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-primary inline-block animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
