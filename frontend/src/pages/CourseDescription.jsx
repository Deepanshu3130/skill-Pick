import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseDetail, joinChannel } from '../operations/apiConnectors';
import { useAuth, useUser } from "@clerk/clerk-react";
import AuthModal from '../Components/AuthModal';
import { 
  MessageSquare, 
  ExternalLink, 
  Clock, 
  Layers, 
  Globe, 
  Video, 
  FileText, 
  Smartphone,
  Bookmark,
  CheckCircle,
  Share2
} from 'lucide-react';

function CourseDescription() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await courseDetail(id);
        if (response?.data?.data) {
          setCourse(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleJoinCommunity = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      setShowAuthModal(true);
      return;
    }

    setJoining(true);
    try {
      const token = await getToken();
      const response = await joinChannel(token, course._id);
      if (response?.data?.success) {
        navigate(`/chatHome`);
      }
    } catch (error) {
      console.error("Error joining community room:", error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center py-32 space-y-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-xs text-base-content/60">Loading course overview...</p>
      </div>
    );
  }

  const isRepo = course.type === 'repo' || course.platform === 'GitHub';

  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16">
      <div className="w-11/12 max-w-6xl mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6 text-left">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="badge badge-neutral font-semibold text-xs">
                  {course.platform || (isRepo ? "GitHub" : "YouTube")}
                </span>
                <span className="badge badge-outline text-xs">
                  {isRepo ? "Open Source Repo" : (course.kind === 'playlist' ? 'Video Playlist' : 'Course')}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content leading-tight">
                {course.title}
              </h1>

              <p className="text-sm text-base-content/70 mt-2 font-medium">
                Provided by <span className="text-base-content font-semibold">{course.provider}</span>
              </p>
            </div>

            {/* Description Section */}
            <div className="card bg-base-200 border border-base-300 p-6 rounded-2xl space-y-3">
              <h2 className="text-base font-bold text-base-content">About this resource</h2>
              <p className="text-sm text-base-content/80 leading-relaxed whitespace-pre-line">
                {course.description || "Comprehensive hands-on material curated for student and developer self-study."}
              </p>
            </div>

            {/* Highlights */}
            <div className="card bg-base-200 border border-base-300 p-6 rounded-2xl space-y-4">
              <h2 className="text-base font-bold text-base-content">What's included</h2>
              <ul className="space-y-3 text-sm text-base-content/80">
                <li className="flex items-start gap-3">
                  <Video className="size-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>Verified content hosted officially on {course.platform || 'YouTube'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageSquare className="size-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>Real-time dedicated study room with fellow learners</span>
                </li>
                <li className="flex items-start gap-3">
                  <FileText className="size-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>Free open access, zero paywalls or subscription gates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar Action Column (1/3 width) */}
          <div className="space-y-6">
            <div className="card bg-base-200 border border-base-300 p-6 rounded-2xl space-y-5 text-left">
              {/* Media Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-base-300 border border-base-300">
                <img 
                  src={course.imageUrl || (isRepo ? 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=80')} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meta Stats List */}
              <div className="space-y-2.5 text-xs text-base-content/80 pt-1 border-t border-base-300">
                {course.duration && (
                  <div className="flex justify-between items-center py-1 border-b border-base-300/50">
                    <span className="flex items-center gap-1.5 text-base-content/60">
                      <Clock className="size-3.5" /> Duration
                    </span>
                    <span className="font-mono font-semibold">{course.duration}</span>
                  </div>
                )}

                {course.lectures && (
                  <div className="flex justify-between items-center py-1 border-b border-base-300/50">
                    <span className="flex items-center gap-1.5 text-base-content/60">
                      <Layers className="size-3.5" /> Lessons / Videos
                    </span>
                    <span className="font-mono font-semibold">{course.lectures}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-1 border-b border-base-300/50">
                  <span className="flex items-center gap-1.5 text-base-content/60">
                    <Globe className="size-3.5" /> Language
                  </span>
                  <span className="font-semibold">{course.language || 'English'}</span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-base-content/60">Access</span>
                  <span className="font-semibold text-success">Free & Open</span>
                </div>
              </div>

              {/* Primary Call to Action */}
              <div className="space-y-2.5 pt-2">
                <button 
                  onClick={handleJoinCommunity}
                  disabled={joining}
                  className="btn btn-primary w-full gap-2 font-semibold text-xs sm:text-sm rounded-xl"
                >
                  <MessageSquare className="size-4" strokeWidth={1.5} />
                  <span>{joining ? "Entering Room..." : "Join Study Room"}</span>
                </button>

                <a 
                  href={course.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full gap-2 font-semibold text-xs sm:text-sm rounded-xl"
                >
                  <span>{isRepo ? "View on GitHub" : "Open Course"}</span>
                  <ExternalLink className="size-4" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

export default CourseDescription;
