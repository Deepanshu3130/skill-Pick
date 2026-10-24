import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github } from 'lucide-react';

function Footer() {
  return (
    <footer className="w-full border-t border-base-300 bg-base-100 py-10 mt-auto">
      <div className="w-11/12 max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        {/* Brand & Note */}
        <div className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-content text-[11px] font-mono font-bold">
              SP
            </div>
            <span className="font-bold text-sm text-base-content">
              Skill<span className="text-primary">Pick</span>
            </span>
          </div>
          <p className="text-xs text-base-content/65 max-w-md leading-relaxed">
            A student-developer community for discovering verified course playlists, open-source repositories, and collaborative study rooms.
          </p>
          <p className="text-[11px] text-base-content/50 font-mono">
            Official YouTube Data API v3 & GitHub REST API. Zero web scraping.
          </p>
        </div>

        {/* Small Navigation Links */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-base-content/75">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/aboutUs" className="hover:text-primary transition-colors">
            About
          </Link>
          <Link to="/Platform/YouTube" className="hover:text-primary transition-colors">
            YouTube
          </Link>
          <Link to="/Platform/GitHub" className="hover:text-primary transition-colors">
            GitHub
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Github className="size-3.5" strokeWidth={1.5} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
