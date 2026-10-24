import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTopicResources, getCourses } from '../operations/apiConnectors';
import CourseCard from "../Components/CourseCard";
import AddResourceModal from "../Components/AddResourceModal";
import Pagination from "../Components/Pagination";
import { 
  Plus, 
  BookOpen, 
  GitBranch, 
  Compass, 
  Search, 
  SlidersHorizontal, 
  X, 
  Filter, 
  Code, 
  Layers, 
  ChevronRight,
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

function Courses() {
  const { query } = useParams();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" | "repos"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [topicInfo, setTopicInfo] = useState(null);
  const [coursesData, setCoursesData] = useState({ main: [], broader: [], similar: [] });
  const [reposData, setReposData] = useState({ main: [], broader: [], similar: [] });

  // Filtering & Sorting State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [courseFormat, setCourseFormat] = useState("all"); // "all" | "playlist" | "video"
  const [coursePlatform, setCoursePlatform] = useState("all"); // "all" | "YouTube" | "Community"
  const [courseSort, setCourseSort] = useState("upvotes"); // "upvotes" | "title-asc" | "title-desc"

  const [repoLanguage, setRepoLanguage] = useState("all"); // "all" | string
  const [repoSort, setRepoSort] = useState("stars"); // "stars" | "forks" | "name-asc"

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        let token = null;
        try {
          token = await getToken();
        } catch {
          // Unauthenticated or token error
        }
        const response = await getTopicResources(query, token);
        if (response && response.data?.success) {
          const { topic, courses, repos } = response.data;
          setTopicInfo(topic || { name: query, slug: query, parent: null, related: [] });
          setCoursesData(courses || { main: [], broader: [], similar: [] });
          setReposData(repos || { main: [], broader: [], similar: [] });
        } else {
          // Fallback to legacy endpoint if topic not found
          const legacyRes = await getCourses(query);
          const legacyItems = legacyRes?.data?.data || [];
          setTopicInfo({ name: query, slug: query, parent: null, related: [] });
          setCoursesData({
            main: legacyItems.filter(i => i.type !== 'repo'),
            broader: [],
            similar: []
          });
          setReposData({
            main: legacyItems.filter(i => i.type === 'repo'),
            broader: [],
            similar: []
          });
        }
      } catch (error) {
        console.error("Error fetching topic resources:", error);
        setTopicInfo({ name: query, slug: query, parent: null, related: [] });
        setCoursesData({ main: [], broader: [], similar: [] });
        setReposData({ main: [], broader: [], similar: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [query]);

  // Reset page when filters or query change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, activeTab, searchKeyword, courseFormat, coursePlatform, courseSort, repoLanguage, repoSort, pageSize]);

  // Dynamic Languages from Repositories
  const availableLanguages = useMemo(() => {
    const counts = {};
    (reposData.main || []).forEach(repo => {
      const lang = repo.meta?.language;
      if (lang) {
        counts[lang] = (counts[lang] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [reposData.main]);

  // Dynamic Format counts from Courses
  const formatCounts = useMemo(() => {
    let playlists = 0;
    let videos = 0;
    (coursesData.main || []).forEach(course => {
      if (course.kind === 'playlist' || (course.lectures && !course.duration)) {
        playlists++;
      } else {
        videos++;
      }
    });
    return {
      all: (coursesData.main || []).length,
      playlists,
      videos
    };
  }, [coursesData.main]);

  // Helper to distinguish Community-submitted courses from official auto-fetched YouTube courses
  const isCommunityResource = (item) => {
    if (!item) return false;
    if (item.addedBy) return true;
    if (item.source && ['manual', 'search-picked', 'search'].includes(item.source)) return true;
    const plat = (item.platform || '').toLowerCase();
    return plat !== 'youtube' && plat !== 'github';
  };

  // Dynamic Platform counts from Courses
  const platformCounts = useMemo(() => {
    let youtube = 0;
    let community = 0;
    (coursesData.main || []).forEach(course => {
      if (isCommunityResource(course)) {
        community++;
      } else {
        youtube++;
      }
    });
    return {
      all: (coursesData.main || []).length,
      youtube,
      community
    };
  }, [coursesData.main]);

  // Filter & Sort Item List
  const filterAndSortItems = (items, isRepoTab) => {
    let filtered = [...items];

    // Search Keyword filter
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(item => {
        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const provider = (item.provider || item.channelOrOwner || "").toLowerCase();
        return title.includes(kw) || desc.includes(kw) || provider.includes(kw);
      });
    }

    if (!isRepoTab) {
      // Courses: Format Filter
      if (courseFormat === "playlist") {
        filtered = filtered.filter(item => item.kind === 'playlist' || (item.lectures && !item.duration));
      } else if (courseFormat === "video") {
        filtered = filtered.filter(item => item.kind === 'video' || (!item.lectures && item.duration));
      }

      // Courses: Platform Filter
      if (coursePlatform === "YouTube") {
        filtered = filtered.filter(item => !isCommunityResource(item));
      } else if (coursePlatform === "Community") {
        filtered = filtered.filter(item => isCommunityResource(item));
      } else if (coursePlatform !== "all") {
        filtered = filtered.filter(item => item.platform?.toLowerCase() === coursePlatform.toLowerCase());
      }

      // Courses: Sorting
      filtered.sort((a, b) => {
        if (courseSort === "upvotes") {
          return (b.upvotes?.length || 0) - (a.upvotes?.length || 0);
        }
        if (courseSort === "title-asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        if (courseSort === "title-desc") {
          return (b.title || "").localeCompare(a.title || "");
        }
        return 0;
      });
    } else {
      // Repos: Language Filter
      if (repoLanguage !== "all") {
        filtered = filtered.filter(item => item.meta?.language?.toLowerCase() === repoLanguage.toLowerCase());
      }

      // Repos: Sorting
      filtered.sort((a, b) => {
        if (repoSort === "stars") {
          return (b.meta?.stars || 0) - (a.meta?.stars || 0);
        }
        if (repoSort === "forks") {
          return (b.meta?.forks || 0) - (a.meta?.forks || 0);
        }
        if (repoSort === "name-asc") {
          return (a.title || "").localeCompare(b.title || "");
        }
        return 0;
      });
    }

    return filtered;
  };

  const isRepoTab = activeTab === "repos";
  const currentDataset = isRepoTab ? reposData : coursesData;

  const filteredMain = filterAndSortItems(currentDataset.main || [], isRepoTab);
  const filteredBroader = filterAndSortItems(currentDataset.broader || [], isRepoTab);
  const filteredSimilar = filterAndSortItems(currentDataset.similar || [], isRepoTab);

  const totalCourses = (coursesData.main?.length || 0) + (coursesData.broader?.length || 0) + (coursesData.similar?.length || 0);
  const totalRepos = (reposData.main?.length || 0) + (reposData.broader?.length || 0) + (reposData.similar?.length || 0);

  // Pagination Calculations on Main Results
  const totalMainItems = filteredMain.length;
  const totalPages = Math.max(1, Math.ceil(totalMainItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedMainItems = filteredMain.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    const targetPage = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(targetPage);
    const feedElement = document.getElementById('results-feed-top');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check if any filter is active
  const hasActiveFilters = isRepoTab
    ? searchKeyword.trim() !== "" || repoLanguage !== "all" || repoSort !== "stars"
    : searchKeyword.trim() !== "" || courseFormat !== "all" || coursePlatform !== "all" || courseSort !== "upvotes";

  const clearAllFilters = () => {
    setSearchKeyword("");
    setCourseFormat("all");
    setCoursePlatform("all");
    setCourseSort("upvotes");
    setRepoLanguage("all");
    setRepoSort("stars");
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen w-full bg-base-100 flex flex-col relative'>
      {/* Header Banner */}
      <div className='w-full bg-base-200/50 border-b border-base-300 pt-24 pb-8'>
        <div className='w-11/12 max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6'>
          <div>
            {/* Topic breadcrumb */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="badge badge-primary font-mono text-xs font-semibold">/{topicInfo?.slug || query}</span>
              {topicInfo?.parent && (
                <span className="text-xs text-base-content/60 flex items-center gap-1">
                  part of <Link to={`/courses/${topicInfo.parent}`} className="text-primary hover:underline font-semibold">{topicInfo.parent}</Link>
                </span>
              )}
            </div>

            <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-base-content'>
              Explore <span className='text-primary'>{topicInfo?.name || query}</span>
            </h1>

            <p className="text-sm text-base-content/70 mt-1.5 max-w-2xl">
              Curated YouTube playlists, video courses, and starred GitHub repositories for learners.
            </p>
          </div>

          {/* daisyUI Tabs (tabs-border) */}
          <div role="tablist" className="tabs tabs-border bg-base-100 p-1 rounded-xl border border-base-300 shadow-xs">
            <button
              role="tab"
              onClick={() => setActiveTab("courses")}
              className={`tab gap-2 text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "courses" ? "tab-active text-primary border-primary" : "text-base-content/70"
              }`}
            >
              <BookOpen className="size-4" strokeWidth={1.5} />
              <span>Courses ({totalCourses})</span>
            </button>
            <button
              role="tab"
              onClick={() => setActiveTab("repos")}
              className={`tab gap-2 text-xs sm:text-sm font-semibold transition-colors ${
                activeTab === "repos" ? "tab-active text-primary border-primary" : "text-base-content/70"
              }`}
            >
              <GitBranch className="size-4" strokeWidth={1.5} />
              <span>Repos ({totalRepos})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-11/12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4 flex-1">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-5 space-y-5">
            <div className="flex justify-between items-center pb-2.5 border-b border-base-300">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" strokeWidth={1.5} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-base-content">Filters & Sort</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Quick Search within Results */}
            <div>
              <label className="text-xs font-bold uppercase text-base-content/70 mb-1.5 block">Search in results</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={isRepoTab ? "Filter repos or author..." : "Filter courses or creator..."}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="input input-sm input-bordered w-full pr-8 text-xs rounded-lg focus:input-primary"
                />
                {searchKeyword ? (
                  <button
                    onClick={() => setSearchKeyword("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                    aria-label="Clear search"
                  >
                    <X className="size-3.5" />
                  </button>
                ) : (
                  <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40 pointer-events-none" />
                )}
              </div>
            </div>

            {/* Courses-specific Filters */}
            {!isRepoTab ? (
              <>
                {/* Format Filter */}
                <div>
                  <h3 className="text-xs font-bold uppercase text-base-content/70 mb-2 flex items-center gap-1.5">
                    <Layers className="size-3.5" strokeWidth={1.5} /> Format
                  </h3>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'all', label: 'All Formats', count: formatCounts.all },
                      { key: 'playlist', label: 'Playlists / Series', count: formatCounts.playlists },
                      { key: 'video', label: 'Single Videos', count: formatCounts.videos }
                    ].map(format => (
                      <button
                        key={format.key}
                        onClick={() => setCourseFormat(format.key)}
                        className={`btn btn-sm justify-between text-xs font-semibold rounded-lg ${
                          courseFormat === format.key ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        <span>{format.label}</span>
                        <span className={`badge badge-xs font-mono ${courseFormat === format.key ? 'badge-neutral' : 'badge-ghost'}`}>
                          {format.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform / Source Filter */}
                <div>
                  <h3 className="text-xs font-bold uppercase text-base-content/70 mb-2">Platform</h3>
                  <div className="flex flex-col gap-1">
                    {[
                      { key: 'all', label: 'All Platforms', count: platformCounts.all },
                      { key: 'YouTube', label: 'YouTube', count: platformCounts.youtube },
                      { key: 'Community', label: 'Community Added', count: platformCounts.community }
                    ].map(platform => (
                      <button
                        key={platform.key}
                        onClick={() => setCoursePlatform(platform.key)}
                        className={`btn btn-sm justify-between text-xs font-semibold rounded-lg ${
                          coursePlatform === platform.key ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        <span>{platform.label}</span>
                        <span className={`badge badge-xs font-mono ${coursePlatform === platform.key ? 'badge-neutral' : 'badge-ghost'}`}>
                          {platform.count}
                        </span>
                      </button>
                    ))}
                  </div>
                  {platformCounts.community === 0 && (
                    <p className="text-[10px] text-base-content/50 mt-1.5 px-1 leading-normal">
                      No community submissions for this topic yet.
                    </p>
                  )}
                </div>

                {/* Sort Filter */}
                <div>
                  <h3 className="text-xs font-bold uppercase text-base-content/70 mb-2">Sort By</h3>
                  <select
                    value={courseSort}
                    onChange={(e) => setCourseSort(e.target.value)}
                    className="select select-bordered select-sm w-full text-xs rounded-lg focus:select-primary"
                  >
                    <option value="upvotes">Most Upvoted / Recommended</option>
                    <option value="title-asc">Title: A to Z</option>
                    <option value="title-desc">Title: Z to A</option>
                  </select>
                </div>
              </>
            ) : (
              /* Repositories-specific Filters */
              <>
                {/* Language Filter */}
                {availableLanguages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase text-base-content/70 mb-2 flex items-center gap-1.5">
                      <Code className="size-3.5" strokeWidth={1.5} /> Language
                    </h3>
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
                      <button
                        onClick={() => setRepoLanguage("all")}
                        className={`btn btn-sm justify-between text-xs font-semibold rounded-lg ${
                          repoLanguage === 'all' ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        <span>All Languages</span>
                        <span className={`badge badge-xs font-mono ${repoLanguage === 'all' ? 'badge-neutral' : 'badge-ghost'}`}>
                          {(reposData.main || []).length}
                        </span>
                      </button>
                      {availableLanguages.map(([lang, count]) => (
                        <button
                          key={lang}
                          onClick={() => setRepoLanguage(repoLanguage === lang ? 'all' : lang)}
                          className={`btn btn-sm justify-between text-xs font-semibold rounded-lg ${
                            repoLanguage === lang ? 'btn-primary' : 'btn-ghost'
                          }`}
                        >
                          <span className="truncate">{lang}</span>
                          <span className={`badge badge-xs font-mono ${repoLanguage === lang ? 'badge-neutral' : 'badge-ghost'}`}>
                            {count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sort Repos */}
                <div>
                  <h3 className="text-xs font-bold uppercase text-base-content/70 mb-2">Sort By</h3>
                  <select
                    value={repoSort}
                    onChange={(e) => setRepoSort(e.target.value)}
                    className="select select-bordered select-sm w-full text-xs rounded-lg focus:select-primary"
                  >
                    <option value="stars">Most Stars (Popular)</option>
                    <option value="forks">Most Forked</option>
                    <option value="name-asc">Repository Name: A to Z</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Related Topics Pill Box */}
          {topicInfo?.related && topicInfo.related.length > 0 && (
            <div className="bg-base-200 border border-base-300 rounded-2xl p-5">
              <h3 className="text-xs font-bold uppercase text-base-content/70 mb-3 flex items-center gap-1.5">
                <Compass className="size-4 text-primary" strokeWidth={1.5} /> Also Explore
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {topicInfo.related.map(slug => (
                  <Link
                    key={slug}
                    to={`/courses/${slug}`}
                    className="badge badge-outline hover:badge-primary font-mono text-xs p-2.5 transition-colors"
                  >
                    /{slug}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resources Feed */}
        <div className="flex-1 min-w-0" id="results-feed-top">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-base-200/80 rounded-xl border border-base-300 text-xs">
              <span className="font-semibold text-base-content/70 flex items-center gap-1">
                <Filter className="size-3" strokeWidth={1.5} /> Active:
              </span>

              {searchKeyword.trim() && (
                <span className="badge badge-primary gap-1 py-2 font-medium">
                  "{searchKeyword}"
                  <button onClick={() => setSearchKeyword("")} className="cursor-pointer hover:opacity-80">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {!isRepoTab && courseFormat !== "all" && (
                <span className="badge badge-primary gap-1 py-2 font-medium">
                  Format: {courseFormat === 'playlist' ? 'Playlists' : 'Videos'}
                  <button onClick={() => setCourseFormat("all")} className="cursor-pointer hover:opacity-80">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {!isRepoTab && coursePlatform !== "all" && (
                <span className="badge badge-primary gap-1 py-2 font-medium">
                  Platform: {coursePlatform}
                  <button onClick={() => setCoursePlatform("all")} className="cursor-pointer hover:opacity-80">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              {isRepoTab && repoLanguage !== "all" && (
                <span className="badge badge-primary gap-1 py-2 font-medium">
                  Language: {repoLanguage}
                  <button onClick={() => setRepoLanguage("all")} className="cursor-pointer hover:opacity-80">
                    <X className="size-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="btn btn-ghost btn-xs text-primary hover:underline ml-auto"
              >
                Reset
              </button>
            </div>
          )}

          {/* Skeleton Loaders (No whole-page spinners) */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="card bg-base-100 border border-base-300 p-4 rounded-2xl flex flex-col md:flex-row gap-4 animate-pulse"
                >
                  <div className="skeleton w-full md:w-64 h-36 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="skeleton h-5 w-3/4 rounded-md" />
                    <div className="skeleton h-4 w-full rounded-md" />
                    <div className="skeleton h-4 w-1/2 rounded-md" />
                    <div className="skeleton h-7 w-24 rounded-md mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {/* 1. Main Results Section */}
              <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold tracking-tight text-base-content">
                    {topicInfo?.name} {isRepoTab ? "Repositories" : "Courses"}
                  </h2>
                  <span className="text-xs text-base-content/60 font-mono font-medium bg-base-200 px-2.5 py-1 rounded-md border border-base-300">
                    {totalMainItems} {isRepoTab ? "repos" : "courses"}
                  </span>
                </div>

                {totalMainItems === 0 ? (
                  <div className="alert alert-neutral border border-base-300 rounded-2xl p-6 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div>
                        <h4 className="font-bold text-sm text-base-content">
                          {!isRepoTab && coursePlatform === "Community" && platformCounts.community === 0
                            ? "No community-added courses for this topic yet."
                            : `No ${isRepoTab ? "repositories" : "courses"} match your current filters.`}
                        </h4>
                        <p className="text-xs text-base-content/70 mt-0.5">
                          {!isRepoTab && coursePlatform === "Community" && platformCounts.community === 0
                            ? "Learners can submit tutorials, Udemy, or Coursera links via the 'Can't find your course?' button below."
                            : 'Try adjusting search terms or add one via the "Can\'t find your course?" button.'}
                        </p>
                      </div>
                    </div>
                    {hasActiveFilters && (
                      <button onClick={clearAllFilters} className="btn btn-sm btn-outline">
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {paginatedMainItems.map(item => (
                        <CourseCard key={item._id} course={item} />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    <Pagination
                      currentPage={validPage}
                      totalItems={totalMainItems}
                      pageSize={pageSize}
                      onPageChange={handlePageChange}
                      onPageSizeChange={(newSize) => {
                        setPageSize(newSize);
                        setCurrentPage(1);
                      }}
                      pageSizeOptions={[6, 10, 20]}
                      className="mt-6"
                    />
                  </>
                )}
              </section>

              {/* 2. Broader Topic Results (From Parent Topic) */}
              {topicInfo?.parent && filteredBroader.length > 0 && (
                <section className="pt-8 border-t border-base-300">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-base-content">
                        From Parent: {topicInfo.parent.replace(/-/g, ' ')}
                      </h3>
                      <span className="badge badge-sm badge-outline font-mono text-[11px]">Broader</span>
                    </div>
                    <Link
                      to={`/courses/${topicInfo.parent}`}
                      className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>View all</span>
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {filteredBroader.slice(0, 3).map(item => (
                      <CourseCard key={item._id} course={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* 3. Similar / Related Topics Results */}
              {filteredSimilar.length > 0 && (
                <section className="pt-8 border-t border-base-300">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-bold text-base-content">
                      Related Recommendations
                    </h3>
                    <span className="badge badge-sm badge-secondary text-[11px] font-medium">Similar</span>
                  </div>

                  <div className="space-y-4">
                    {filteredSimilar.slice(0, 3).map(item => (
                      <CourseCard key={item._id} course={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Side Button: "Can't find your course?" */}
      {/* Desktop: Right edge vertically centered */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:block">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary shadow-xl rounded-l-2xl rounded-r-none gap-2 px-4 py-3 hover:translate-x-[-3px] transition-transform flex items-center border-r-0 cursor-pointer"
          aria-label="Can't find your course? Add it here"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span className="font-semibold text-xs tracking-tight">Can't find your course?</span>
        </button>
      </div>

      {/* Mobile: Floating bottom-right button */}
      <div className="fixed bottom-6 right-6 z-40 block md:hidden">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary shadow-xl rounded-full gap-2 px-4 py-3 hover:scale-105 transition-transform flex items-center cursor-pointer"
          aria-label="Can't find your course? Add it here"
        >
          <Plus className="size-4" strokeWidth={2} />
          <span className="font-semibold text-xs">Can't find your course?</span>
        </button>
      </div>

      {/* Add Resource Modal / Drawer */}
      <AddResourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        currentTopic={topicInfo?.slug || query || 'web-development'}
      />
    </div>
  );
}

export default Courses;
