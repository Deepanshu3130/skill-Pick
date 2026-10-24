import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiSearch, FiGitBranch, FiBookOpen, FiStar, FiArrowRight, FiExternalLink, FiMessageSquare } from 'react-icons/fi';
import {
  submitResourceLink,
  searchWebResources,
  pickResourceItem,
  searchGithubReposApi,
  pickGithubRepoItem,
  submitManualResource
} from '../operations/apiConnectors';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const AddResourceModal = ({ isOpen, onClose, currentTopic = "web-development" }) => {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  const [activeTab, setActiveTab] = useState("course"); // "course" | "github"
  
  // Tab 1 (Course) state
  const [courseInput, setCourseInput] = useState("");
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseResults, setCourseResults] = useState(null); // { searchId, query, results: [] }
  const [courseEditQuery, setCourseEditQuery] = useState("");
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualDescription, setManualDescription] = useState("");
  const [manualUrl, setManualUrl] = useState("");

  // Tab 2 (GitHub) state
  const [githubInput, setGithubInput] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubResults, setGithubResults] = useState(null); // { searchId, results: [] }

  // Shared completed status: { status, message, resource }
  const [feedback, setFeedback] = useState(null);

  const courseInputRef = useRef(null);
  const githubInputRef = useRef(null);

  // Focus input when panel opens, or reset on close
  useEffect(() => {
    if (isOpen) {
      setFeedback(null);
      setIsManualMode(false);
      setCourseResults(null);
      setGithubResults(null);
      setTimeout(() => {
        if (activeTab === "course") {
          courseInputRef.current?.focus();
        } else {
          githubInputRef.current?.focus();
        }
      }, 100);
    } else {
      setCourseInput("");
      setGithubInput("");
      setCourseResults(null);
      setGithubResults(null);
      setFeedback(null);
      setIsManualMode(false);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // TAB 1: Course submission
  const handleCourseSubmit = async (e) => {
    if (e) e.preventDefault();
    const raw = courseInput.trim();
    if (!raw) return;

    // Detect GitHub link pasted on Course tab -> auto switch to GitHub tab
    if (raw.includes("github.com")) {
      setActiveTab("github");
      setGithubInput(raw);
      setCourseInput("");
      handleGithubSubmit(null, raw);
      return;
    }

    setCourseLoading(true);
    setFeedback(null);
    setCourseResults(null);

    try {
      const token = await getToken();
      const res = await submitResourceLink(raw, currentTopic, token);

      if (res?.status === "choose") {
        setCourseResults({
          searchId: res.searchId,
          query: res.query || raw,
          results: res.results || []
        });
        setCourseEditQuery(res.query || raw);
        setManualUrl(raw);
      } else if (res?.status === "added") {
        setFeedback({
          status: "added",
          message: res.message || (res.resource?.status === "approved" ? "Added! Your resource is now live." : "Thanks! Your resource is visible to you now and will go public after 3 upvotes."),
          resource: res.resource
        });
      } else if (res?.status === "exists") {
        setFeedback({
          status: "exists",
          message: "This one is already here. Join its room below.",
          resource: res.resource
        });
      } else if (res?.status === "invalid") {
        setFeedback({
          status: "invalid",
          message: "That doesn't look like a valid link. Please paste the full URL starting with https://"
        });
      } else if (res?.status === "rate_limited") {
        setFeedback({
          status: "rate_limited",
          message: "You've reached today's limit of 10 submissions. Try again tomorrow."
        });
      } else {
        setFeedback({
          status: "service_busy",
          message: "We're a bit busy right now. Please try again in a few minutes."
        });
      }
    } catch {
      setFeedback({
        status: "service_busy",
        message: "We're a bit busy right now. Please try again in a few minutes."
      });
    } finally {
      setCourseLoading(false);
    }
  };

  // Re-search with edited query
  const handleEditSearch = async (e) => {
    if (e) e.preventDefault();
    if (!courseEditQuery.trim()) return;

    setCourseLoading(true);
    try {
      const token = await getToken();
      const res = await searchWebResources(courseEditQuery.trim(), currentTopic, token);
      if (res?.status === "choose") {
        setCourseResults({
          searchId: res.searchId,
          query: res.query || courseEditQuery,
          results: res.results || []
        });
      } else if (res?.status === "service_busy") {
        setFeedback({
          status: "service_busy",
          message: "We're a bit busy right now. Please try again in a few minutes."
        });
      }
    } finally {
      setCourseLoading(false);
    }
  };

  // Pick a course card
  const handlePickCourse = async (index) => {
    if (!courseResults?.searchId) return;

    setCourseLoading(true);
    try {
      const token = await getToken();
      const res = await pickResourceItem(courseResults.searchId, index, token);
      if (res?.status === "added") {
        setCourseResults(null);
        setFeedback({
          status: "added",
          message: res.message || "Added! Your resource is now live.",
          resource: res.resource
        });
      } else if (res?.status === "exists") {
        setCourseResults(null);
        setFeedback({
          status: "exists",
          message: "This one is already here. Join its room below.",
          resource: res.resource
        });
      } else if (res?.status === "rate_limited") {
        setFeedback({
          status: "rate_limited",
          message: "You've reached today's limit of 10 submissions. Try again tomorrow."
        });
      } else {
        setFeedback({
          status: "service_busy",
          message: "We're a bit busy right now. Please try again in a few minutes."
        });
      }
    } finally {
      setCourseLoading(false);
    }
  };

  // Manual course submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualUrl.trim()) return;

    setCourseLoading(true);
    try {
      const token = await getToken();
      const res = await submitManualResource({
        url: manualUrl.trim(),
        title: manualTitle.trim(),
        description: manualDescription.trim(),
        topicSlug: currentTopic
      }, token);

      if (res?.status === "added") {
        setIsManualMode(false);
        setCourseResults(null);
        setFeedback({
          status: "added",
          message: "Thanks! Your resource is visible to you now and will go public after 3 upvotes.",
          resource: res.resource
        });
      } else if (res?.status === "exists") {
        setIsManualMode(false);
        setCourseResults(null);
        setFeedback({
          status: "exists",
          message: "This one is already here. Join its room below.",
          resource: res.resource
        });
      } else if (res?.status === "rate_limited") {
        setFeedback({
          status: "rate_limited",
          message: "You've reached today's limit of 10 submissions. Try again tomorrow."
        });
      } else {
        setFeedback({
          status: "service_busy",
          message: "We're a bit busy right now. Please try again in a few minutes."
        });
      }
    } finally {
      setCourseLoading(false);
    }
  };

  // TAB 2: GitHub repo search / submission
  const handleGithubSubmit = async (e, overrideQuery = null) => {
    if (e) e.preventDefault();
    const raw = (overrideQuery || githubInput).trim();
    if (!raw) return;

    setGithubLoading(true);
    setFeedback(null);
    setGithubResults(null);

    try {
      const token = await getToken();
      const res = await searchGithubReposApi(raw, currentTopic, token);

      if (res?.status === "choose") {
        setGithubResults({
          searchId: res.searchId,
          results: res.results || []
        });
      } else if (res?.status === "exists") {
        setFeedback({
          status: "exists",
          message: "This repo is already here. Join its room below.",
          resource: res.resource
        });
      } else if (res?.status === "no_repos") {
        setFeedback({
          status: "no_repos",
          message: "No repos found. Try different words or paste the repo link."
        });
      } else if (res?.status === "rate_limited") {
        setFeedback({
          status: "rate_limited",
          message: "Search limit reached, try again later"
        });
      } else {
        setFeedback({
          status: "service_busy",
          message: "We're a bit busy right now. Please try again in a few minutes."
        });
      }
    } catch {
      setFeedback({
        status: "service_busy",
        message: "We're a bit busy right now. Please try again in a few minutes."
      });
    } finally {
      setGithubLoading(false);
    }
  };

  // Pick a GitHub repo card
  const handlePickRepo = async (index) => {
    if (!githubResults?.searchId) return;

    setGithubLoading(true);
    try {
      const token = await getToken();
      const res = await pickGithubRepoItem(githubResults.searchId, index, token);
      if (res?.status === "added") {
        setGithubResults(null);
        setFeedback({
          status: "added",
          message: "Added! The repo is now live.",
          resource: res.resource
        });
      } else if (res?.status === "exists") {
        setGithubResults(null);
        setFeedback({
          status: "exists",
          message: "This repo is already here. Join its room below.",
          resource: res.resource
        });
      } else if (res?.status === "rate_limited") {
        setFeedback({
          status: "rate_limited",
          message: "You've reached today's limit of 10 submissions. Try again tomorrow."
        });
      } else {
        setFeedback({
          status: "service_busy",
          message: "We're a bit busy right now. Please try again in a few minutes."
        });
      }
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Side Panel on Desktop, Bottom Sheet on Mobile */}
      <div 
        className="relative z-10 bg-base-100 w-full sm:w-[480px] h-[90vh] sm:h-full mt-auto sm:mt-0 rounded-t-2xl sm:rounded-none shadow-2xl flex flex-col border-l border-base-300 font-sans animate-slideLeft overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* Header with Close */}
        <div className="p-5 border-b border-base-200 flex justify-between items-center bg-base-200/40">
          <div>
            <h2 className="text-[20px] font-semibold text-base-content leading-tight">
              {activeTab === "course" ? "Add a course" : "Add a GitHub repo"}
            </h2>
            <p className="text-[14px] font-normal text-base-content/75 mt-0.5">
              {activeTab === "course" 
                ? "Paste a course link and we'll find it for you." 
                : "Search by name or paste a repo link."}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost text-base-content/70 hover:text-base-content"
            aria-label="Close panel"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Tab List */}
        <div 
          className="flex border-b border-base-200 bg-base-200/20 px-5" 
          role="tablist"
          aria-label="Resource type selection"
        >
          <button
            role="tab"
            aria-selected={activeTab === "course"}
            onClick={() => { setActiveTab("course"); setFeedback(null); }}
            className={`py-3 px-4 text-[14px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "course"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <FiBookOpen className="size-4" /> Course
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "github"}
            onClick={() => { setActiveTab("github"); setFeedback(null); }}
            className={`py-3 px-4 text-[14px] font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === "github"
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            <FiGitBranch className="size-4" /> GitHub repo
          </button>
        </div>

        {/* Panel Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {!isSignedIn ? (
            <div className="p-8 text-center bg-base-200/50 rounded-2xl border border-base-300 space-y-3">
              <p className="text-[14px] font-medium text-base-content/80">
                Please log in to add a course.
              </p>
            </div>
          ) : (
            <>
              {/* Feedback messages / cards */}
              {feedback && (
                <div className="space-y-4 animate-fadeIn">
                  <div 
                    className={`p-4 rounded-xl text-[14px] font-medium border ${
                      feedback.status === "added"
                        ? "bg-success/10 border-success/30 text-success"
                        : feedback.status === "exists"
                        ? "bg-info/10 border-info/30 text-info"
                        : feedback.status === "rate_limited" || feedback.status === "service_busy" || feedback.status === "invalid"
                        ? "bg-warning/10 border-warning/30 text-warning"
                        : "bg-base-200 border-base-300 text-base-content/80"
                    }`}
                  >
                    {feedback.message}
                  </div>

                  {feedback.resource && (
                    <div className="card bg-base-200 border border-base-300 shadow-sm p-4 rounded-xl space-y-3">
                      <div className="flex gap-3 items-center">
                        <img 
                          src={feedback.resource.imageUrl || feedback.resource.thumbnail || 'https://via.placeholder.com/80'} 
                          alt="" 
                          className="w-14 h-14 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm truncate">{feedback.resource.title}</h4>
                          <p className="text-xs text-base-content/60 truncate">
                            {feedback.resource.channelOrOwner || feedback.resource.provider}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-base-300/50">
                        <Link
                          to={`/course/${feedback.resource._id}`}
                          onClick={onClose}
                          className="btn btn-sm btn-primary gap-1"
                        >
                          <FiMessageSquare className="size-4" /> Join room
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 1: COURSE TAB */}
              {activeTab === "course" && (
                <div role="tabpanel" className="space-y-5">
                  {!courseResults && !isManualMode && (
                    <form onSubmit={handleCourseSubmit} className="space-y-4">
                      <div>
                        <input
                          ref={courseInputRef}
                          type="url"
                          placeholder="Paste a YouTube, Udemy or Coursera link"
                          value={courseInput}
                          onChange={(e) => setCourseInput(e.target.value)}
                          className="input input-bordered w-full text-[16px] focus:outline-none"
                          disabled={courseLoading}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={courseLoading || !courseInput.trim()}
                        className="btn btn-primary w-full text-[14px] font-semibold"
                      >
                        {courseLoading ? "Searching..." : "Find course"}
                      </button>
                    </form>
                  )}

                  {/* Picker Screen (Status choose) */}
                  {courseResults && !isManualMode && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <h3 className="text-[16px] font-semibold text-base-content">
                          Select your course
                        </h3>
                        <p className="text-[13px] text-base-content/75">
                          We found these on the web. Pick the one you meant.
                        </p>
                      </div>

                      <div className="space-y-2.5 max-h-[42vh] overflow-y-auto pr-1">
                        {courseResults.results.map((item) => (
                          <div
                            key={item.index}
                            onClick={() => handlePickCourse(item.index)}
                            className="p-3.5 bg-base-200/60 hover:bg-base-200 border border-base-300 rounded-xl transition-all cursor-pointer flex flex-col gap-1 hover:border-primary/50"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-semibold text-sm line-clamp-1 text-base-content">
                                {item.title}
                              </h4>
                              {item.domain && (
                                <span className="badge badge-sm badge-outline font-mono shrink-0 text-[11px]">
                                  {item.domain}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                              {item.snippet}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Edit query box */}
                      <div className="pt-2 border-t border-base-200 space-y-3">
                        <label className="text-xs font-medium text-base-content/70 block">
                          Not right? Try a different search
                        </label>
                        <form onSubmit={handleEditSearch} className="join w-full">
                          <input
                            type="text"
                            value={courseEditQuery}
                            onChange={(e) => setCourseEditQuery(e.target.value)}
                            className="input input-sm input-bordered join-item flex-1 text-sm focus:outline-none"
                            disabled={courseLoading}
                          />
                          <button
                            type="submit"
                            disabled={courseLoading || !courseEditQuery.trim()}
                            className="btn btn-sm btn-primary join-item"
                          >
                            {courseLoading ? "Searching..." : "Search"}
                          </button>
                        </form>

                        <button
                          type="button"
                          onClick={() => setIsManualMode(true)}
                          className="btn btn-sm btn-ghost w-full text-xs text-base-content/75 hover:text-base-content"
                        >
                          None of these, enter details manually
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual Form */}
                  {isManualMode && (
                    <form onSubmit={handleManualSubmit} className="space-y-4 animate-fadeIn">
                      <div>
                        <h3 className="text-[16px] font-semibold text-base-content">
                          Enter details manually
                        </h3>
                        <p className="text-[13px] text-base-content/75">
                          Provide course information for community review.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="label py-1">
                            <span className="label-text text-xs font-semibold">Course title *</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Course title"
                            value={manualTitle}
                            onChange={(e) => setManualTitle(e.target.value)}
                            className="input input-bordered w-full text-sm focus:outline-none"
                            required
                            disabled={courseLoading}
                          />
                        </div>

                        <div>
                          <label className="label py-1">
                            <span className="label-text text-xs font-semibold">Course URL *</span>
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={manualUrl}
                            onChange={(e) => setManualUrl(e.target.value)}
                            className="input input-bordered w-full text-sm focus:outline-none"
                            required
                            disabled={courseLoading}
                          />
                        </div>

                        <div>
                          <label className="label py-1">
                            <span className="label-text text-xs font-semibold">Description (optional)</span>
                          </label>
                          <textarea
                            placeholder="What does this course cover?"
                            value={manualDescription}
                            onChange={(e) => setManualDescription(e.target.value)}
                            className="textarea textarea-bordered w-full text-sm focus:outline-none h-20"
                            disabled={courseLoading}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsManualMode(false)}
                          className="btn btn-sm btn-ghost flex-1"
                        >
                          Back to results
                        </button>
                        <button
                          type="submit"
                          disabled={courseLoading || !manualTitle.trim() || !manualUrl.trim()}
                          className="btn btn-sm btn-primary flex-1"
                        >
                          {courseLoading ? "Submitting..." : "Submit for review"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: GITHUB REPO TAB */}
              {activeTab === "github" && (
                <div role="tabpanel" className="space-y-5">
                  <form onSubmit={(e) => handleGithubSubmit(e)} className="space-y-4">
                    <div>
                      <input
                        ref={githubInputRef}
                        type="text"
                        placeholder="Search repos, or paste github.com/owner/repo"
                        value={githubInput}
                        onChange={(e) => setGithubInput(e.target.value)}
                        className="input input-bordered w-full text-[16px] focus:outline-none"
                        disabled={githubLoading}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={githubLoading || !githubInput.trim()}
                      className="btn btn-primary w-full text-[14px] font-semibold"
                    >
                      {githubLoading ? "Searching..." : "Search"}
                    </button>
                  </form>

                  {/* GitHub Results Screen */}
                  {githubResults && githubResults.results.length > 0 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <h3 className="text-[16px] font-semibold text-base-content">
                          Select your repo
                        </h3>
                        <p className="text-[13px] text-base-content/75">
                          Pick the repo you want to add.
                        </p>
                      </div>

                      <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                        {githubResults.results.map((repo) => (
                          <div
                            key={repo.index}
                            className="p-3.5 bg-base-200/60 hover:bg-base-200 border border-base-300 rounded-xl transition-all flex justify-between items-center gap-3"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm truncate text-primary">
                                  {repo.fullName}
                                </span>
                              </div>
                              <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                                {repo.description || "No description provided."}
                              </p>
                              <div className="flex items-center gap-3 text-[11px] text-base-content/60 pt-0.5">
                                {repo.stars !== undefined && (
                                  <span className="flex items-center gap-1 text-amber-500 font-medium">
                                    <FiStar className="size-3" /> {repo.stars.toLocaleString()}
                                  </span>
                                )}
                                {repo.language && (
                                  <span className="badge badge-xs badge-outline">
                                    {repo.language}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handlePickRepo(repo.index)}
                              disabled={githubLoading}
                              className="btn btn-xs btn-primary shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddResourceModal;
