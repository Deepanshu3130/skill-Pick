import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import axios from 'axios';

// Helper to bold the matching query characters
function highlightMatch(text, match) {
  if (!text || !match || !match.trim()) return text;
  try {
    const escaped = match.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === match.trim().toLowerCase() ? (
        <strong key={i} className="font-bold text-primary underline decoration-primary/30">
          {part}
        </strong>
      ) : (
        part
      )
    );
  } catch {
    return text;
  }
}

const SearchAutocomplete = ({ 
  placeholder = "Search topics, courses, repos (e.g. react, dsa, python)...", 
  className = "", 
  inputClassName = "",
  buttonText = "Search",
  showButton = true
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const containerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const API_BASE = API_ROOT;

  // Debounced search with AbortController
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setLoading(true);

      try {
        const response = await axios.get(`${API_BASE}/suggest`, {
          params: { q: trimmed },
          signal: controller.signal
        });

        if (response.data?.success) {
          const list = response.data.suggestions || [];
          setSuggestions(list);
          setIsOpen(list.length > 0);
          setSelectedIndex(-1);
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Autocomplete error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (topic) => {
    setIsOpen(false);
    setQuery(topic.name);
    navigate(`/courses/${topic.slug}`);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelect(suggestions[selectedIndex]);
      return;
    }

    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/courses/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit(e);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form 
        onSubmit={handleSubmit} 
        className="flex items-center w-full bg-base-100 border border-base-300 hover:border-base-content/30 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-xl overflow-hidden shadow-xs transition-all"
      >
        <div className="relative flex-1 flex items-center pl-3.5">
          <Search className="size-4 sm:size-5 text-base-content/40 shrink-0 mr-2.5" strokeWidth={1.5} />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full py-2.5 sm:py-3 pr-8 bg-transparent text-xs sm:text-sm text-base-content placeholder:text-base-content/50 focus:outline-hidden ${inputClassName}`}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
          {loading && (
            <span className="loading loading-spinner loading-xs absolute right-3 text-primary" />
          )}
        </div>
        {showButton && (
          <button 
            type="submit" 
            className="btn btn-primary rounded-none rounded-r-xl h-full min-h-[44px] px-5 text-xs sm:text-sm font-semibold shrink-0 cursor-pointer"
          >
            <span>{buttonText}</span>
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown - Clean Main Data / Heading Only */}
      {isOpen && suggestions.length > 0 && (
        <ul 
          className="menu menu-sm absolute z-50 left-0 right-0 mt-1.5 bg-base-100 border border-base-300 rounded-box shadow-xl max-h-72 overflow-y-auto p-1.5 space-y-0.5"
          role="listbox"
        >
          {suggestions.map((topic, index) => {
            const isSelected = index === selectedIndex;

            return (
              <li
                key={topic._id || topic.slug}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(topic)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center py-2.5 px-3.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-content font-medium"
                      : "hover:bg-base-200 text-base-content"
                  }`}
                >
                  <div className="text-sm font-semibold truncate">
                    {highlightMatch(topic.name, query)}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;
