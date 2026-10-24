import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  GitFork, 
  ExternalLink, 
  MessageSquare, 
  ThumbsUp, 
  Flag, 
  Clock, 
  Layers 
} from 'lucide-react';
import { upvoteResource, reportResource } from '../operations/apiConnectors';
import { useAuth } from '@clerk/clerk-react';

function CourseCard({ course }) {
  const { getToken } = useAuth();
  const [upvotes, setUpvotes] = useState(course.upvotes?.length || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [status, setStatus] = useState(course.status || 'approved');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isRepo = course.type === 'repo' || course.platform === 'GitHub';

  const handleUpvote = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasUpvoted) return;

    try {
      const token = await getToken();
      const res = await upvoteResource(course._id, token);
      if (res) {
        setUpvotes(res.upvotesCount);
        setStatus(res.status);
        setHasUpvoted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasReported) return;

    try {
      const token = await getToken();
      const res = await reportResource(course._id, token);
      if (res) {
        setStatus(res.status);
        setHasReported(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. REPO CARD: Compact horizontal layout
  // ---------------------------------------------------------------------------
  if (isRepo) {
    const ownerAvatar = course.meta?.ownerAvatar || `https://github.com/${(course.provider || 'github').split('/')[0]}.png?size=64`;

    return (
      <div className="card w-full bg-base-100 hover:bg-base-200/50 border border-base-300 rounded-xl transition-all duration-150 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Main info with avatar */}
          <div className="flex items-start gap-3.5 min-w-0">
            <img
              src={ownerAvatar}
              alt={`${course.provider || 'owner'} avatar`}
              className="w-9 h-9 rounded-lg border border-base-300 shrink-0 object-cover bg-base-200"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
              }}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Link
                  to={`/course/${course._id}`}
                  className="font-bold text-sm sm:text-base text-base-content hover:text-primary transition-colors truncate"
                >
                  {course.title}
                </Link>

                <span className="badge badge-neutral badge-xs font-mono">repo</span>

                {status === 'pending' && (
                  <span className="badge badge-warning badge-xs font-medium">Pending Review</span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-base-content/70 line-clamp-2 leading-relaxed">
                {course.description || "No description provided for this repository."}
              </p>

              {/* Technical stats in Monospace */}
              <div className="flex flex-wrap items-center gap-3.5 mt-2.5 text-xs text-base-content/60 font-mono">
                <span className="font-sans font-medium text-base-content/80">
                  {course.provider}
                </span>

                {course.meta?.language && (
                  <span className="flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-primary/70 shrink-0" />
                    <span>{course.meta.language}</span>
                  </span>
                )}

                {course.meta?.stars !== undefined && (
                  <span className="flex items-center gap-1 text-base-content/80" title="GitHub Stars">
                    <Star className="size-3 text-warning fill-warning" strokeWidth={1.5} />
                    <span>{course.meta.stars.toLocaleString()}</span>
                  </span>
                )}

                {course.meta?.forks !== undefined && (
                  <span className="flex items-center gap-1 text-base-content/70" title="Forks">
                    <GitFork className="size-3" strokeWidth={1.5} />
                    <span>{course.meta.forks.toLocaleString()}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0 sm:self-center mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-base-200">
            <Link
              to={`/course/${course._id}`}
              className="btn btn-outline btn-xs gap-1 font-semibold"
              title="Join study chat room"
            >
              <MessageSquare className="size-3" strokeWidth={1.5} />
              <span>Room</span>
            </Link>

            <a
              href={course.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-xs gap-1 font-semibold"
            >
              <span>GitHub</span>
              <ExternalLink className="size-3" strokeWidth={1.5} />
            </a>

            <button
              onClick={handleUpvote}
              className={`btn btn-ghost btn-xs btn-square ${hasUpvoted ? 'text-primary' : 'text-base-content/60'}`}
              title="Upvote repository"
              aria-label="Upvote"
            >
              <ThumbsUp className="size-3" strokeWidth={1.5} />
            </button>
            <span className="text-[11px] font-mono text-base-content/60 -ml-1">
              {upvotes}
            </span>

            <button
              onClick={handleReport}
              className={`btn btn-ghost btn-xs btn-square ${hasReported ? 'text-error' : 'text-base-content/40 hover:text-error'}`}
              title="Report issue"
              aria-label="Report"
            >
              <Flag className="size-3" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. COURSE CARD: 16:9 Thumbnail, title, creator, badges, room button
  // ---------------------------------------------------------------------------
  const thumbnail = course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=80';

  return (
    <div className="card w-full bg-base-100 hover:bg-base-200/40 border border-base-300 rounded-2xl transition-all duration-150 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* 16:9 Aspect Ratio Thumbnail Container */}
        <div className="w-full md:w-64 shrink-0 bg-base-200 relative aspect-video overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="skeleton w-full h-full absolute inset-0 rounded-none" />
          )}

          <img
            src={imageError ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=80' : thumbnail}
            alt={course.title}
            className={`w-full h-full object-cover transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* Badges on Thumbnail */}
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="badge badge-sm badge-neutral font-semibold text-[11px]">
              {course.platform || 'YouTube'}
            </span>
            {status === 'pending' && (
              <span className="badge badge-sm badge-warning font-medium text-[11px]">Pending</span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="card-title text-base sm:text-lg font-bold text-base-content hover:text-primary transition-colors line-clamp-2">
                <Link to={`/course/${course._id}`}>
                  {course.title}
                </Link>
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-base-content/70 line-clamp-2 leading-relaxed">
              {course.description || "Explore this course to build end-to-end skills."}
            </p>
          </div>

          {/* Metadata & Actions Footer */}
          <div className="pt-3 mt-3 border-t border-base-300 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-base-content/70">
              <span className="font-semibold text-base-content/90">
                by {course.provider}
              </span>

              {course.lectures && (
                <span className="flex items-center gap-1 font-mono text-[11px]" title="Lectures / Videos">
                  <Layers className="size-3.5" strokeWidth={1.5} />
                  <span>{course.lectures}</span>
                </span>
              )}

              {course.duration && (
                <span className="flex items-center gap-1 font-mono text-[11px]" title="Duration">
                  <Clock className="size-3.5" strokeWidth={1.5} />
                  <span>{course.duration}</span>
                </span>
              )}

              <span className="badge badge-xs badge-ghost font-medium">
                {course.kind === 'playlist' ? 'Playlist' : (course.kind === 'video' ? 'Video' : 'Course')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to={`/course/${course._id}`}
                className="btn btn-outline btn-xs gap-1 font-semibold"
                title="Join course room chat"
              >
                <MessageSquare className="size-3" strokeWidth={1.5} />
                <span>Room</span>
              </Link>

              <a
                href={course.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-xs gap-1 font-semibold"
              >
                <span>Watch</span>
                <ExternalLink className="size-3" strokeWidth={1.5} />
              </a>

              <div className="flex items-center">
                <button
                  onClick={handleUpvote}
                  className={`btn btn-ghost btn-xs btn-square ${hasUpvoted ? 'text-primary' : 'text-base-content/60'}`}
                  title="Upvote course"
                  aria-label="Upvote"
                >
                  <ThumbsUp className="size-3" strokeWidth={1.5} />
                </button>
                <span className="text-[11px] font-mono text-base-content/60">
                  {upvotes}
                </span>
              </div>

              <button
                onClick={handleReport}
                className={`btn btn-ghost btn-xs btn-square ${hasReported ? 'text-error' : 'text-base-content/40 hover:text-error'}`}
                title="Report issue"
                aria-label="Report"
              >
                <Flag className="size-3" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
