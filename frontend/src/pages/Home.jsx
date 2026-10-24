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
  Database, 
  Layers,
  Play,
  Users,
  CheckCircle2,
  Sparkles,
  Star,
  Clock,
  HelpCircle,
  ExternalLink,
  Flame
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
    icon: BookOpen,
    accent: "text-red-500",
    badge: "Free Videos"
  },
  {
    name: "GitHub",
    title: "Open Source Roadmaps & Repos",
    desc: "Starred project implementations, developer roadmaps, and real codebases to study and fork.",
    route: "/Platform/GitHub",
    icon: GitBranch,
    accent: "text-purple-500",
    badge: "Code & Stars"
  },
  {
    name: "Community",
    title: "Student-Submitted Links",
    desc: "Verified learning materials, notes, and tutorials suggested directly by active learners.",
    route: "/Platform/Community",
    icon: MessageSquare,
    accent: "text-emerald-500",
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
      {/* 1. Hero Section with Interactive Mockup */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 border-b border-base-300 bg-base-200/40">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(circle,#818cf8_1px,transparent_1px)] [background-size:24px_24px]" 
          aria-hidden="true"
        />

        <div className="relative w-11/12 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading, Subtitle & Search */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 text-left space-y-6"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-base-100 border border-base-300 text-xs font-medium text-base-content/80 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>Open, student-driven developer community</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-base-content leading-[1.15]">
                Find a course, <br className="hidden sm:inline" />
                join its room, <br className="hidden sm:inline" />
                <span className="text-primary underline decoration-primary/30 decoration-wavy underline-offset-8">ask your doubt.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-base-content/75 leading-relaxed max-w-xl">
                SkillPick curates top YouTube video courses and starred GitHub repositories by topic. 
                Every resource connects to a live study room so you can code together, share repos, and unblock errors.
              </p>

              {/* Search Bar - Hero Focal Point */}
              <div className="w-full max-w-xl bg-base-100 p-2 rounded-2xl border-2 border-primary/20 hover:border-primary/50 shadow-md transition-colors">
                <SearchAutocomplete
                  placeholder="What skill do you want to learn? (e.g. react, dsa, python)..."
                  buttonText="Search"
                  showButton={true}
                  inputClassName="input-md text-sm border-0 focus:outline-hidden bg-transparent"
                />
              </div>

              {/* Popular Topics Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1">
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
              <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-base-content/70">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-4 text-success" />
                  <span>100% Free Resources</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-4 text-success" />
                  <span>Real-time Study Rooms</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-4 text-success" />
                  <span>Community Verified</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Visual Interactive Room Mockup */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              {/* Outer Window Container */}
              <div className="card bg-base-100 border border-base-300 shadow-xl rounded-2xl overflow-hidden text-left">
                {/* Window Chrome Titlebar */}
                <div className="px-4 py-3 bg-base-200/80 border-b border-base-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-error/70 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-warning/70 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-success/70 inline-block" />
                  </div>
                  <div className="text-[11px] font-mono text-base-content/60 truncate max-w-[200px]">
                    skillpick.dev/courses/react
                  </div>
                  <span className="badge badge-xs badge-primary font-mono">LIVE</span>
                </div>

                {/* Course Card Preview Inside Window */}
                <div className="p-4 space-y-3">
                  <div className="p-3 rounded-xl bg-base-200 border border-base-300 flex items-start gap-3">
                    {/* Visual Course Thumbnail Mock */}
                    <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-indigo-500/20 to-primary/30 border border-primary/20 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
                      <Code className="size-6 text-primary" />
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono bg-neutral/80 text-neutral-content px-1 rounded-sm">
                        12h 45m
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-primary font-semibold uppercase">
                        <span>YouTube Playlist</span> • <span>freeCodeCamp</span>
                      </div>
                      <h4 className="text-xs font-bold text-base-content truncate mt-0.5">
                        Full Stack React 19 & Next.js Architecture
                      </h4>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] text-base-content/60">48 lessons</span>
                        <span className="btn btn-primary btn-xs text-[10px] h-6 min-h-0 px-2 rounded-md">
                          Join Room
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connected Live Room Chat Simulation */}
                  <div className="pt-2 border-t border-base-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                        <MessageSquare className="size-3 text-primary" />
                        Room Doubt Feed
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        14 online
                      </span>
                    </div>

                    {/* Chat Bubble 1: Student Question */}
                    <div className="chat chat-start">
                      <div className="chat-image avatar">
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                          AL
                        </div>
                      </div>
                      <div className="chat-header text-[10px] text-base-content/60 mb-0.5">
                        Alex • <span className="font-mono text-primary">@ 01:24:10</span>
                      </div>
                      <div className="chat-bubble chat-bubble-neutral text-xs leading-snug py-2 px-3 rounded-xl max-w-[90%]">
                        How do I revalidate the Next.js cache after a Server Action mutation?
                      </div>
                    </div>

                    {/* Chat Bubble 2: Peer Solution */}
                    <div className="chat chat-end">
                      <div className="chat-image avatar">
                        <div className="w-7 h-7 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[10px] font-bold">
                          RK
                        </div>
                      </div>
                      <div className="chat-header text-[10px] text-base-content/60 mb-0.5">
                        Rahul
                      </div>
                      <div className="chat-bubble chat-bubble-primary text-xs leading-snug py-2 px-3 rounded-xl max-w-[90%]">
                        Call <code className="bg-primary-content/20 px-1 py-0.5 rounded text-[11px] font-mono">revalidatePath('/dashboard')</code> right after your DB write!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Activity Badge */}
                <div className="px-4 py-2 bg-base-200/50 border-t border-base-300 flex items-center justify-between text-[11px] text-base-content/60">
                  <span>Press <kbd className="kbd kbd-xs">Ctrl + K</kbd> to search anytime</span>
                  <span className="font-mono text-primary font-medium">react-room #3</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. How It Works - Visual 3-step explanation */}
      <section className="py-16 md:py-24 border-b border-base-300">
        <div className="w-11/12 max-w-6xl mx-auto px-4">
          <div className="max-w-2xl text-left mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Workflow</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-base-content">
              How SkillPick works
            </h3>
            <p className="text-sm sm:text-base text-base-content/70 mt-2">
              A straightforward path from discovering a course to unblocking your doubts with fellow learners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="card bg-base-200 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    01
                  </div>
                  <Search className="size-5 text-base-content/40" />
                </div>
                <h4 className="text-base font-bold text-base-content mb-2">Search by Topic or Query</h4>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                  Type any programming concept, framework, or creator. Our dual-layer index matches topics or scans courses and repositories instantly.
                </p>
              </div>

              {/* Step 1 Visual Mini Mockup */}
              <div className="p-3 bg-base-100 rounded-xl border border-base-300 space-y-2">
                <div className="flex items-center gap-2 text-xs text-base-content/50 font-mono">
                  <Search className="size-3 text-primary" />
                  <span className="text-base-content font-medium">dsa</span>
                  <span className="animate-pulse">|</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="badge badge-xs badge-neutral font-mono">/dsa</span>
                  <span className="badge badge-xs badge-ghost font-mono">/python</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card bg-base-200 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    02
                  </div>
                  <BookOpen className="size-5 text-base-content/40" />
                </div>
                <h4 className="text-base font-bold text-base-content mb-2">Learn from Verified Materials</h4>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                  Watch official YouTube courses and clone curated GitHub repos. No paywalls, no scraped previews, and no spam.
                </p>
              </div>

              {/* Step 2 Visual Mini Mockup */}
              <div className="p-3 bg-base-100 rounded-xl border border-base-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                    <Play className="size-3.5 fill-current" />
                  </div>
                  <div className="text-[11px] font-semibold text-base-content leading-tight">
                    YouTube Series
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-warning font-medium">
                  <Star className="size-3 fill-current" />
                  <span>4.8k stars</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card bg-base-200 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                    03
                  </div>
                  <MessageSquare className="size-5 text-base-content/40" />
                </div>
                <h4 className="text-base font-bold text-base-content mb-2">Discuss in Study Rooms</h4>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                  Every course has its own room. Ask questions on specific video timestamps, exchange code snippets, and solve bugs together.
                </p>
              </div>

              {/* Step 3 Visual Mini Mockup */}
              <div className="p-3 bg-base-100 rounded-xl border border-base-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] text-base-content/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                  <span className="font-semibold text-base-content">Study Room #24</span>
                </div>
                <div className="text-[11px] text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">
                  "Solved! Thanks for the tip"
                </div>
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
                  className="card bg-base-100 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md group text-left"
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

      {/* 4. Featured Learning Paths */}
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
                  className="card bg-base-200 hover:bg-base-200/90 border border-base-300 p-6 rounded-2xl flex flex-col justify-between text-left transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5 text-primary">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="size-5" strokeWidth={1.5} />
                        </div>
                        <h4 className="text-base font-bold text-base-content">{path.topic}</h4>
                      </div>
                      <span className="badge badge-xs badge-neutral font-mono">
                        {path.coursesCount}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-4">
                      {path.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-base-300 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {path.tags.map((t) => (
                        <span key={t} className="badge badge-xs badge-outline font-mono">
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/courses/${path.slug}`}
                      className="btn btn-xs btn-primary gap-1"
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
      <section className="py-12 bg-base-200/50">
        <div className="w-11/12 max-w-4xl mx-auto px-4">
          <div className="card bg-base-100 border border-base-300 p-8 rounded-2xl shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="size-3.5" /> Learner-Powered
              </div>
              <h3 className="text-xl font-bold text-base-content">
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
