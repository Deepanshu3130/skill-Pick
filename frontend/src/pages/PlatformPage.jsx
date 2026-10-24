import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlatformCourses } from '../operations/apiConnectors';
import useCourseStore from '../store/useCourseStore';
import CourseCard from "../Components/CourseCard";
import Pagination from "../Components/Pagination";
import { Search, SlidersHorizontal, X } from 'lucide-react';

function PlatformPage() {
  const { setPlatformCourses, platformCourses } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const { platform } = useParams();

  // Search & Sort State
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let img = "/youtube-logo.jpg";
  if (platform === "GitHub") {
    img = "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
  } else if (platform === "Community") {
    img = "/avatar.png";
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await getPlatformCourses(platform);
        if (response?.data?.data) {
          setPlatformCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching platform resources:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [platform, setPlatformCourses]);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, sortBy, pageSize]);

  // Filter & Sort
  const filteredCourses = useMemo(() => {
    let list = [...(platformCourses || [])];

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      list = list.filter(item => {
        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        const provider = (item.provider || item.channelOrOwner || "").toLowerCase();
        return title.includes(kw) || desc.includes(kw) || provider.includes(kw);
      });
    }

    if (sortBy === "title-asc") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "upvotes-or-stars") {
      list.sort((a, b) => {
        const valA = a.meta?.stars || a.upvotes?.length || 0;
        const valB = b.meta?.stars || b.upvotes?.length || 0;
        return valB - valA;
      });
    }

    return list;
  }, [platformCourses, searchKeyword, sortBy]);

  // Pagination calculation
  const totalItems = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    const targetPage = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(targetPage);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className='min-h-screen bg-base-100 flex flex-col'>
      {/* Header Banner */}
      <div className='w-full bg-base-200 border-b border-base-300 pt-24 pb-8'>
        <div className='w-11/12 max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6'>
          <div className='max-w-2xl'>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary font-semibold text-xs">{platform} Platform</span>
              <span className="text-xs text-base-content/60">{platformCourses.length} total resources</span>
            </div>
            <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight'>
              Resources on <span className='text-primary'>{platform}</span>
            </h1>
            {platform === 'YouTube' && (
              <p className='mt-2 text-base-content/70'>
                Comprehensive, free video courses, full playlists, and hands-on tutorials from top creators worldwide.
              </p>
            )}
            {platform === 'GitHub' && (
              <p className='mt-2 text-base-content/70'>
                Starred open-source repositories, developer project roadmaps, and complete implementations to learn by building.
              </p>
            )}
            {platform !== 'YouTube' && platform !== 'GitHub' && (
              <p className='mt-2 text-base-content/70'>
                Curated skill resources discovered and organized by our learning community.
              </p>
            )}
          </div>
          <img 
            src={img} 
            alt={`${platform} logo`} 
            className="w-24 h-24 object-contain rounded-2xl bg-base-100 p-2 shadow-sm border border-base-300 shrink-0" 
          />
        </div>
      </div>
     
      {/* Main Content */}
      <div className="w-11/12 max-w-7xl mx-auto py-8 px-4 flex-1">
        {/* Controls Toolbar: Search & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 p-4 bg-base-200 rounded-2xl border border-base-300">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={`Search in ${platform} resources...`}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="input input-sm input-bordered w-full pr-8 text-xs rounded-lg focus:input-primary"
            />
            {searchKeyword ? (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-base-content/40 pointer-events-none" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-base-content/70 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select select-bordered select-xs rounded-lg text-xs font-medium focus:select-primary"
            >
              <option value="default">Default Order</option>
              <option value="upvotes-or-stars">{platform === 'GitHub' ? 'Most Stars' : 'Most Upvoted'}</option>
              <option value="title-asc">Title: A to Z</option>
            </select>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-24 gap-3">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="text-sm text-base-content/60">Loading resources...</p>
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-16 bg-base-200 rounded-2xl border border-base-300 space-y-2">
              <p className="font-semibold text-base-content/80 text-base">No resources found for {platform}.</p>
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword("")}
                  className="btn btn-xs btn-primary mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}

              {/* Pagination */}
              <Pagination
                currentPage={validPage}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[6, 10, 20]}
                className="mt-6"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlatformPage;
