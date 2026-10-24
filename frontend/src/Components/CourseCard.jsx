import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiGitBranch, FiExternalLink, FiMessageSquare, FiThumbsUp, FiFlag } from 'react-icons/fi';
import { upvoteResource, reportResource } from '../operations/apiConnectors';
import { useAuth } from '@clerk/clerk-react';

function CourseCard({ course }) {
  const { getToken } = useAuth();
  const [upvotes, setUpvotes] = useState(course.upvotes?.length || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [status, setStatus] = useState(course.status || 'approved');

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

  return (
    <div className="card w-full shadow-sm hover:shadow-md border border-base-200 bg-base-200 transition-all mb-4 overflow-hidden"> 
      <div className="flex flex-col md:flex-row">
        
        {/* Thumbnail / Icon */}
        <figure className="w-full md:w-1/4 h-36 md:h-auto overflow-hidden bg-base-300 relative flex items-center justify-center p-2"> 
          <img 
            src={course.imageUrl || (isRepo ? 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' : 'https://via.placeholder.com/400x225')} 
            alt={course.title}
            className={`w-full h-full object-cover rounded-lg ${isRepo ? 'max-w-[80px] max-h-[80px] object-contain' : ''}`}
            loading="lazy"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            <span className={`badge badge-sm font-semibold ${isRepo ? 'badge-neutral' : 'badge-primary'}`}>
              {course.platform}
            </span>
            {status === 'pending' && (
              <span className="badge badge-sm badge-warning">Pending Review</span>
            )}
          </div>
        </figure>

        {/* Details */}
        <div className="card-body p-4 w-full md:w-3/4 flex flex-col justify-between"> 
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="card-title text-base md:text-lg font-bold hover:text-primary transition-colors">
                <Link to={`/course/${course._id}`}>
                  {course.title}
                </Link>
              </h2>
            </div>
            
            <p className="text-base-content/70 text-xs md:text-sm line-clamp-2 mt-1">
              {course.description}
            </p> 
          </div>

          {/* Metadata badges */}
          <div className="divider my-1"></div> 

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-base-content/70">
              <span className="font-medium text-base-content/90">
                by {course.provider}
              </span>

              {isRepo ? (
                <>
                  {course.meta?.language && (
                    <span className="badge badge-sm badge-outline">
                      {course.meta.language}
                    </span>
                  )}
                  {course.meta?.stars !== undefined && (
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <FiStar className="size-3" /> {course.meta.stars.toLocaleString()}
                    </span>
                  )}
                  {course.meta?.forks !== undefined && (
                    <span className="flex items-center gap-1 font-medium">
                      <FiGitBranch className="size-3" /> {course.meta.forks.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {course.duration && (
                    <span>⏳ {course.duration}</span>
                  )}
                  {course.lectures && (
                    <span>📚 {course.lectures}</span>
                  )}
                  <span className="badge badge-sm badge-ghost font-medium capitalize">
                    {course.kind === 'playlist' ? 'Playlist' : (course.kind === 'video' ? 'Video' : (course.type || 'Course'))}
                  </span>
                </>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Community Room link */}
              <Link 
                to={`/course/${course._id}`} 
                className="btn btn-xs btn-outline btn-primary gap-1"
                title="Join room chat"
              >
                <FiMessageSquare className="size-3" /> Room
              </Link>

              {/* External Link */}
              <a 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-xs btn-primary gap-1"
              >
                <FiExternalLink className="size-3" /> {isRepo ? 'Repo' : 'Open'}
              </a>

              {/* Upvote & Report */}
              <button 
                onClick={handleUpvote} 
                className={`btn btn-xs btn-ghost gap-1 ${hasUpvoted ? 'text-primary' : ''}`}
                title="Upvote resource"
              >
                <FiThumbsUp className="size-3" /> {upvotes}
              </button>

              <button 
                onClick={handleReport} 
                className={`btn btn-xs btn-ghost text-error/70 hover:text-error ${hasReported ? 'text-error' : ''}`}
                title="Report resource"
              >
                <FiFlag className="size-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
