import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  GitBranch, 
  ArrowRight, 
  Code, 
  Terminal, 
  Layers,
  CheckCircle2,
  Sparkles,
  Flame,
  Video,
  MessagesSquare,
  Compass
} from 'lucide-react';
import SearchAutocomplete from '../Components/SearchAutocomplete';
import WarningModal from '../Components/WarningModal';

const POPULAR_TOPICS = [
  { name: "React", slug: "react" },
  { name: "DSA", slug: "dsa" },
  { name: "Python", slug: "python" },
  { name: "Web Development", slug: "web-development" },
  { name: "System Design", slug: "system-design" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Docker", slug: "docker" },
  { name: "Machine Learning", slug: "machine-learning" },
];

const PLATFORMS = [
  {
    name: "YouTube",
    title: "Curated Playlists & Courses",
    desc: "Structured, high-yield video courses and hands-on playlists from industry practitioners.",
    route: "/Platform/YouTube",
    icon: Video,
    badge: "Free Videos"
  },
  {
    name: "GitHub",
    title: "Open Source Roadmaps & Repos",
    desc: "Starred project implementations, developer roadmaps, and real codebases to study and fork.",
    route: "/Platform/GitHub",
    icon: GitBranch,
    badge: "Code & Roadmaps"
  },
  {
    name: "Community",
    title: "Student-Submitted Links",
    desc: "Verified learning materials, notes, and tutorials suggested directly by active learners.",
    route: "/Platform/Community",
    icon: MessageSquare,
    badge: "Peer Verified"
  }
];

const FEATURED_PATHS = [
  {
    topic: "Web Development",
    slug: "web-development",
    desc: "Full-stack foundations covering modern HTML, CSS, JavaScript, React, and server-side runtimes.",
    icon: Code,
    tags: ["react", "nextjs", "nodejs"],
    coursesCount: "28+ courses"
  },
  {
    topic: "Data Structures & Algorithms",
    slug: "dsa",
    desc: "Problem-solving patterns, array algorithms, trees, dynamic programming, and interview prep.",
    icon: Terminal,
    tags: ["dsa", "c-plus-plus", "python"],
    coursesCount: "34+ courses"
  },
  {
    topic: "System Design & DevOps",
    slug: "system-design",
    desc: "Distributed architecture, caching, microservices, containerization with Docker and Kubernetes.",
    icon: Layers,
    tags: ["system-design", "docker", "devops"],
    coursesCount: "19+ courses"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      setShowWarningModal(true);
      sessionStorage.setItem("hasSeenModal", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col overflow-x-hidden">
      {/* 1. Hero Section - Centered & Authoritative */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 border-b border-base-300 bg-base-200/40">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-15 bg-[radial-gradient(circle,#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" 
          aria-hidden="true"
        />

        <div className="relative w-11/12 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-100 border border-base-300 text-xs font-medium text-base-content/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              <span>Student-curated developer learning platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-base-content leading-[1.12]">
              Find a course, join its room, <br className="hidden sm:inline" />
              <span className="text-primary">solve doubts together.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-base-content/75 leading-relaxed max-w-2xl mx-auto">
              SkillPick indexes top YouTube video courses and starred GitHub repositories by topic. 
              Every resource connects to a live study room so you can code together, share repos, and unblock errors.
            </p>

            {/* Hero Search Box - Clean, Single Border */}
            <div className="w-full max-w-2xl mx-auto pt-2">
              <SearchAutocomplete
                placeholder="What skill do you want to learn? (e.g. react, dsa, python)..."
                buttonText="Search"
                showButton={true}
              />
            </div>

            {/* Popular Topics Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1 mr-1">
                <Flame className="size-3.5 text-primary" /> Popular:
              </span>
              {POPULAR_TOPICS.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/courses/${topic.slug}`}
                  className="badge badge-sm badge-outline hover:badge-primary font-mono text-xs py-2 px-2.5 transition-all hover:scale-105"
                >
                  /{topic.slug}
                </Link>
              ))}
            </div>

            {/* Value Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-base-content/70">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-success" />
                <span>100% Free Materials</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-success" />
                <span>Topic-Linked Study Rooms</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="size-4 text-success" />
                <span>Starred GitHub Repositories</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Three Pillars / How It Works */}
      <section className="py-16 md:py-24 border-b border-base-300">
        <div className="w-11/12 max-w-6xl mx-auto px-4">
          <div className="max-w-2xl text-left mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Workflow</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content">
              How SkillPick works
            </h3>
            <p className="text-sm sm:text-base text-base-content/70 mt-2">
              A straightforward path from searching a skill to unblocking your doubts with fellow learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="card bg-base-200/60 border border-base-300 p-6 rounded-2xl text-left transition-all duration-200 hover:border-primary/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    01
                  </div>
                  <Search className="size-5 text-base-content/40" strokeWidth={1.5} />
                </div>
                <h4 className="text-base font-bold text-base-content mb-2">Search by Topic or Query</h4>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                  Type any programming concept, technology, or framework. The dual-layer search matches verified topic hubs or scans resources instantly.
                </p>
              </div>

              <div className="p-3 bg-base-100 rounded-xl border border-base-300 text-xs font-mono text-base-content/60 flex items-center justify-between">
                <span>/courses/dsa</span>
                <span className="badge badge-xs badge-neutral">Topic Hub</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card bg-base-200/60 border border-base-300 p-6 rounded-2xl text-left transition-all duration-200 hover:border-primary/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    02
                  </div>
                  <BookOpen className="size-5 text-base-content/40" strokeWidth={1.5} />
                </div>
                <h4 className="text-base font-bold text-base-content mb-2">Learn from Verified Materials</h4>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                  Access structured YouTube courses and cloned GitHub starter repos. No paywalls, no scraped previews, and no spam.
                </p>
              </div>

              <div className="p-3 bg-base-100 rounded-xl border border-base-300 text-xs font-mono text-base-content/60 flex items-center justify-between">
                <span>YouTube & GitHub</span>
                <span className="badge badge-xs badge-success text-success-content">Verified</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card bg-base-200/60 border border-base-300 p-6 rounded-2xl text-left transition-all duration-200 hover:border-primary/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    03
                  </div>
                  <MessagesSquare className="size-5 text-base-content/40" strokeWidth={1.5} />
                </div>
                <h4 className="text-base font-bold text-base-content mb-2">Discuss in Study Rooms</h4>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                  Every resource is linked to an active room. Ask questions on video timestamps, share code snippets, and solve bugs together.
                </p>
              </div>

              <div className="p-3 bg-base-100 rounded-xl border border-base-300 text-xs font-mono text-base-content/60 flex items-center justify-between">
                <span>Live Discussion</span>
                <span className="badge badge-xs badge-primary">Real-time</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Browse By Platform */}
      <section className="py-16 md:py-20 border-b border-base-300 bg-base-200/30">
        <div className="w-11/12 max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 text-left">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Sources</h2>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
                Browse by content type
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              return (
                <Link
                  key={platform.name}
                  to={platform.route}
                  className="card bg-base-100 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl transition-all duration-200 hover:border-primary/40 group text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-base-200 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                      {platform.badge}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-base-content group-hover:text-primary transition-colors mb-1.5">
                    {platform.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-4">
                    {platform.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <span>Explore resources</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Learning Paths (Zero Overlap Guaranteed) */}
      <section className="py-16 md:py-20 border-b border-base-300">
        <div className="w-11/12 max-w-6xl mx-auto px-4">
          <div className="text-left mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Curriculum</h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Featured skill paths
            </h3>
            <p className="text-sm text-base-content/70 mt-1">
              Curated sequences for interview readiness, full-stack development, and architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.slug}
                  className="card bg-base-200/60 border border-base-300 p-6 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 hover:border-primary/40"
                >
                  <div>
                    {/* Top Row: Icon + Course Count Badge (Separate from title) */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </div>
                      <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                        {path.coursesCount}
                      </span>
                    </div>

                    {/* Title with full dedicated width */}
                    <h4 className="text-base sm:text-lg font-bold text-base-content mb-2 leading-snug">
                      {path.topic}
                    </h4>
                    <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                      {path.desc}
                    </p>
                  </div>

                  {/* Footer Row: Tags + Button */}
                  <div className="pt-4 border-t border-base-300/80 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {path.tags.map((t) => (
                        <span key={t} className="badge badge-xs badge-ghost font-mono text-base-content/70">
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/courses/${path.slug}`}
                      className="btn btn-xs btn-primary gap-1 shrink-0 font-medium"
                    >
                      <span>Explore</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Community "Can't find your course" Callout Banner */}
      <section className="py-14 bg-base-200/40">
        <div className="w-11/12 max-w-4xl mx-auto px-4">
          <div className="card bg-base-100 border border-base-300 p-7 sm:p-8 rounded-2xl shadow-xs text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="size-3.5" /> Learner-Powered
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-base-content">
                Found a great course that isn't on SkillPick?
              </h3>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Add any YouTube video, Udemy course, or GitHub repo. We auto-tag it to the topic and generate an instant study room for you and fellow learners.
              </p>
            </div>
            <Link
              to="/courses/react"
              className="btn btn-primary btn-sm shrink-0 gap-1.5"
            >
              <span>Explore & Add Course</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Check */}
      {showWarningModal && (
        <WarningModal onClose={() => setShowWarningModal(false)} />
      )}
    </div>
  );
};

export default Home;
