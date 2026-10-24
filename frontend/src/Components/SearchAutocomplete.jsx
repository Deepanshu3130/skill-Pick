import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

const SearchAutocomplete = ({ 
  placeholder = "What skill do you want to master today?", 
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

  const rawBase = import.meta.env.VITE_BASE_URL ? import.meta.env.VITE_BASE_URL.trim() : "";
  const API_BASE = (rawBase ? rawBase.replace(/\/v1$/, "") : "") || (import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api");

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
      <form onSubmit={handleSubmit} className="join w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={`input input-bordered join-item w-full focus:outline-none text-base-content placeholder:text-base-content/60 ${inputClassName}`}
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={isOpen}
          />
          {loading && (
            <span className="loading loading-spinner loading-xs absolute right-3 top-1/2 -translate-y-1/2 text-primary" />
          )}
        </div>
        {showButton && (
          <button type="submit" className="btn btn-primary join-item">
            <FiSearch className="mr-2" /> {buttonText}
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <ul 
          className="absolute z-50 left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-box shadow-2xl max-h-72 overflow-y-auto divide-y divide-base-200"
          role="listbox"
        >
          {suggestions.map((topic, index) => {
            const isSelected = index === selectedIndex;
            // Check if user's search matches an alias
            const matchingAlias = topic.aliases?.find(a => 
              a.toLowerCase().includes(query.trim().toLowerCase()) &&
              a.toLowerCase() !== topic.name.toLowerCase()
            );

            return (
              <li
                key={topic._id || topic.slug}
                onClick={() => handleSelect(topic)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`p-3 cursor-pointer transition-colors flex items-center justify-between text-left ${
                  isSelected ? "bg-primary text-primary-content" : "hover:bg-base-200"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div>
                  <div className="font-semibold text-sm sm:text-base">
                    {topic.name}
                  </div>
                  {matchingAlias && (
                    <span className={`text-xs ${isSelected ? "text-primary-content/80" : "text-base-content/60"}`}>
                      Also known as: <em>{matchingAlias}</em>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {topic.parent && (
                    <span className={`badge badge-sm ${isSelected ? "badge-neutral" : "badge-outline opacity-70"}`}>
                      in {topic.parent}
                    </span>
                  )}
                  <span className={`text-xs opacity-60 font-mono ${isSelected ? "text-primary-content" : ""}`}>
                    /{topic.slug}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;
