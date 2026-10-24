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
  Video, 
  Radio, 
  Network, 
  Cpu, 
  Database,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import SearchAutocomplete from '../Components/SearchAutocomplete';
import WarningModal from '../Components/WarningModal';

const POPULAR_TOPICS = [
  { name: "React", slug: "react" },
  { name: "DSA", slug: "dsa" },
  { name: "Python", slug: "python" },
  { name: "System Design", slug: "system-design" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Docker", slug: "docker" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Machine Learning", slug: "machine-learning" },
];

const ARCHITECTURE_LAYERS = [
  {
    num: "01",
    code: "SIGNAL",
    title: "Dual Ingestion Pipeline",
    desc: "Ingests structured video playlists from YouTube Data API v3 and starred repositories from GitHub REST API. Zero paywalls, zero scraping.",
    icon: Radio,
    badge: "API Ingestion"
  },
  {
    num: "02",
    code: "TAXONOMY",
    title: "Hierarchical Knowledge Graph",
    desc: "Every skill maps to parent and child domains with automatic keyword tagging, alias resolution, and related topic co-occurrence graphs.",
    icon: Network,
    badge: "Auto-Tagging"
  },
  {
    num: "03",
    code: "SURFACE",
    title: "High-Yield Learning Hubs",
    desc: "Clean 16:9 player links, verified lecture counts, duration badges, and cloneable repositories filtered by language and popularity.",
    icon: Cpu,
    badge: "16:9 Player & Repos"
  },
  {
    num: "04",
    code: "REFLEX",
    title: "Real-Time Study Rooms",
    desc: "Every course is wired to an active peer room. Ask timestamp-linked questions, exchange code snippets, and solve bugs together.",
    icon: MessageSquare,
    badge: "Live Doubts"
  }
];

const PLATFORMS = [
  {
    name: "YouTube",
    title: "Structured Video Playlists",
    desc: "Curated end-to-end courses and playlists from proven developer practitioners, structured by difficulty and duration.",
    route: "/Platform/YouTube",
    icon: Video,
    accent: "text-red-500",
    badge: "Free Courses"
  },
  {
    name: "GitHub",
    title: "Open Source Codebases",
    desc: "Production repos, developer roadmaps, and starter architectures to clone, inspect, and practice what you watch.",
    route: "/Platform/GitHub",
    icon: GitBranch,
    accent: "text-purple-500",
    badge: "Code & Repos"
  },
  {
    name: "Community",
    title: "Peer-Submitted Resources",
    desc: "External course links, Udemy/Coursera tutorials, and documentation verified and voted by active learners.",
    route: "/Platform/Community",
    icon: MessageSquare,
    accent: "text-emerald-500",
    badge: "Community Added"
  }
];

const FEATURED_PATHS = [
  {
    topic: "Web Development",
    slug: "web-development",
    desc: "Full-stack foundations covering modern HTML, CSS, JavaScript, React, and server-side runtimes.",
    icon: Code,
    tags: ["react", "nextjs", "nodejs"],
    coursesCount: "28+ resources"
  },
  {
    topic: "Data Structures & Algorithms",
    slug: "dsa",
    desc: "Problem-solving patterns, array algorithms, trees, dynamic programming, and interview prep.",
    icon: Terminal,
    tags: ["dsa", "c-plus-plus", "python"],
    coursesCount: "34+ resources"
  },
  {
    topic: "System Design & DevOps",
    slug: "system-design",
    desc: "Distributed architecture, caching, microservices, containerization with Docker and Kubernetes.",
    icon: Layers,
    tags: ["system-design", "docker", "devops"],
    coursesCount: "19+ resources"
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
    <div className="min-h-screen bg-base-100 flex flex-col overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* 1. Hero Section - Statement-First Architectural Header */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 border-b border-base-300 bg-base-100">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(circle,#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" 
          aria-hidden="true"
        />

        <div className="relative w-11/12 max-w-5xl mx-auto px-4 text-center space-y-7">
          
          {/* Technical Kicker Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200/80 border border-base-300 text-[11px] font-mono uppercase tracking-wider text-base-content/80"
          >
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            <span>Architecture // Student-Curated Developer Stack</span>
          </motion.div>

          {/* Statement Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-base-content leading-[1.12] max-w-4xl mx-auto"
          >
            Learning is not just watching videos. <br className="hidden sm:inline" />
            <span className="text-primary font-black">It is code, practice, and community.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-sm sm:text-base md:text-lg text-base-content/75 leading-relaxed max-w-2xl mx-auto"
          >
            SkillPick integrates structured YouTube courses, starred GitHub repositories, and real-time study rooms into a single cohesive learning system.
          </motion.p>

          {/* Command-line Style Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full max-w-2xl mx-auto pt-2"
          >
            <SearchAutocomplete
              placeholder="Search by skill, language, or concept (e.g. react, dsa, rust)..."
              buttonText="Search"
              showButton={true}
            />

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-base-content/60 pt-3">
              <span className="font-mono text-[11px] text-base-content/50">try:</span>
              {[
                { label: "react", query: "react" },
                { label: "dsa", query: "dsa" },
                { label: "system-design", query: "system-design" },
                { label: "docker", query: "docker" },
                { label: "python", query: "python" }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(`/courses/${item.query}`)}
                  className="px-2 py-0.5 rounded-md bg-base-200/70 hover:bg-base-300 border border-base-300 hover:border-primary/40 text-base-content/75 hover:text-primary transition-all font-mono text-[11px] cursor-pointer"
                >
                  /{item.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Popular Topics Ribbon */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-2 pt-1"
          >
            <span className="text-xs font-semibold text-base-content/60 font-mono">Topics:</span>
            {POPULAR_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                to={`/courses/${topic.slug}`}
                className="badge badge-sm badge-outline hover:badge-primary font-mono text-xs py-2 px-2.5 transition-all hover:scale-105"
              >
                /{topic.slug}
              </Link>
            ))}
          </motion.div>

        </div>
      </section>

      {/* 2. Technical Metrics Banner (Bento Dividers) */}
      <section className="border-b border-base-300 bg-base-200/40">
        <div className="w-11/12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-base-300 text-left">
            <div className="p-6 sm:p-8 space-y-1">
              <span className="text-[11px] font-mono uppercase text-primary font-bold">01 // CONTENT</span>
              <h3 className="text-base sm:text-lg font-bold text-base-content">100% Free Resources</h3>
              <p className="text-xs text-base-content/65">Full YouTube series without paywalls.</p>
            </div>

            <div className="p-6 sm:p-8 space-y-1">
              <span className="text-[11px] font-mono uppercase text-primary font-bold">02 // CODE</span>
              <h3 className="text-base sm:text-lg font-bold text-base-content">GitHub Star Repos</h3>
              <p className="text-xs text-base-content/65">Starred codebases and starter templates.</p>
            </div>

            <div className="p-6 sm:p-8 space-y-1">
              <span className="text-[11px] font-mono uppercase text-primary font-bold">03 // REFLEX</span>
              <h3 className="text-base sm:text-lg font-bold text-base-content">Topic Study Rooms</h3>
              <p className="text-xs text-base-content/65">Ask doubts tied directly to courses.</p>
            </div>

            <div className="p-6 sm:p-8 space-y-1">
              <span className="text-[11px] font-mono uppercase text-primary font-bold">04 // VERIFICATION</span>
              <h3 className="text-base sm:text-lg font-bold text-base-content">Official API Feeds</h3>
              <p className="text-xs text-base-content/65">Zero scraped previews or ads.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4-Layer Learning Stack (Brainfullstack Inspired) */}
      <section className="py-20 md:py-28 border-b border-base-300 bg-base-100">
        <div className="w-11/12 max-w-6xl mx-auto px-4 text-left">
          
          <div className="max-w-2xl mb-14 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              [ THE ARCHITECTURE ]
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
              Learning, all the way down.
            </h2>
            <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">
              We own and connect every layer between finding a topic and solving coding blockers with peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div 
                  key={layer.code}
                  className="card bg-base-200/50 hover:bg-base-200/90 border border-base-300 p-7 sm:p-8 rounded-2xl transition-all duration-200 hover:border-primary/40 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm">
                        {layer.num}
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-base-content/60">
                        // {layer.code}
                      </span>
                    </div>
                    <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                      {layer.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-base-content">
                    {layer.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                    {layer.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. Browse By Platform Sources */}
      <section className="py-20 md:py-28 border-b border-base-300 bg-base-200/30">
        <div className="w-11/12 max-w-6xl mx-auto px-4 text-left">
          
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              [ SOURCES ]
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
              Curated by content type
            </h2>
            <p className="text-sm sm:text-base text-base-content/70">
              High-yield video courses, open-source repositories, and verified student links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              return (
                <Link
                  key={platform.name}
                  to={platform.route}
                  className="card bg-base-100 hover:bg-base-200/80 border border-base-300 p-7 rounded-2xl transition-all duration-200 hover:border-primary/40 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className="p-3 rounded-xl bg-base-200 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </div>
                      <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                        {platform.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-base-content group-hover:text-primary transition-colors mb-2">
                      {platform.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                      {platform.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-base-300/80 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Explore resources</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Featured Curriculum Paths */}
      <section className="py-20 md:py-28 border-b border-base-300 bg-base-100">
        <div className="w-11/12 max-w-6xl mx-auto px-4 text-left">
          
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              [ CURRICULUM ]
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
              Structured learning tracks
            </h2>
            <p className="text-sm sm:text-base text-base-content/70">
              Curated sequences for interview readiness, full-stack development, and system architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.slug}
                  className="card bg-base-200/50 hover:bg-base-200/90 border border-base-300 p-7 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-primary/40"
                >
                  <div>
                    {/* Header Row: Icon + Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </div>
                      <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                        {path.coursesCount}
                      </span>
                    </div>

                    {/* Title with full width */}
                    <h3 className="text-base sm:text-lg font-bold text-base-content mb-2 leading-snug">
                      {path.topic}
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                      {path.desc}
                    </p>
                  </div>

                  {/* Footer Row: Tags + Explore */}
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

      {/* 6. The Missing Course Protocol - Technical Bottom Banner */}
      <section className="py-16 bg-base-200/50">
        <div className="w-11/12 max-w-4xl mx-auto px-4">
          <div className="card bg-base-100 border border-base-300 p-8 sm:p-10 rounded-2xl shadow-xs text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                <Sparkles className="size-3.5" /> [ COMMUNITY PROTOCOL ]
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight">
                Found a course that isn't on SkillPick?
              </h3>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Paste any YouTube link, Udemy course, or GitHub repository. Our pipeline auto-tags it to the topic hierarchy and generates an instant study room.
              </p>
            </div>
            <Link
              to="/courses/react"
              className="btn btn-primary btn-sm shrink-0 gap-1.5 font-medium px-5"
            >
              <span>Add Resource</span>
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
