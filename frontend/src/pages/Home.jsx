import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  GitBranch, 
  ArrowRight, 
  Code, 
  Terminal, 
  Database, 
  Layers 
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
    icon: BookOpen
  },
  {
    name: "GitHub",
    title: "Open Source Roadmaps & Repos",
    desc: "Starred project implementations, developer roadmaps, and real codebases to study and fork.",
    route: "/Platform/GitHub",
    icon: GitBranch
  },
  {
    name: "Community",
    title: "Student-Submitted Links",
    desc: "Verified learning materials, notes, and tutorials suggested directly by active learners.",
    route: "/Platform/Community",
    icon: MessageSquare
  }
];

const FEATURED_PATHS = [
  {
    topic: "Web Development",
    slug: "web-development",
    desc: "Full-stack foundations covering modern HTML, CSS, JavaScript, React, and server-side runtimes.",
    icon: Code,
    tags: ["react", "nextjs", "nodejs"]
  },
  {
    topic: "Data Structures & Algorithms",
    slug: "dsa",
    desc: "Problem-solving patterns, array algorithms, trees, dynamic programming, and interview prep.",
    icon: Terminal,
    tags: ["dsa", "c-plus-plus", "python"]
  },
  {
    topic: "System Design & DevOps",
    slug: "system-design",
    desc: "Distributed architecture, caching, microservices, containerization with Docker and Kubernetes.",
    icon: Layers,
    tags: ["system-design", "docker", "devops"]
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
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* 1. Hero Section - Search as the focal point */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 border-b border-base-300 bg-base-200/50">
        <div className="w-11/12 max-w-4xl mx-auto px-4 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-200 border border-base-300 text-xs font-medium text-base-content/80 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <span>Open, student-driven developer community</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-base-content leading-tight mb-4">
            Find a course, join its room, <br className="hidden sm:inline" />
            ask your doubt.
          </h1>

          <p className="text-base sm:text-lg text-base-content/70 leading-relaxed max-w-2xl mb-8">
            SkillPick curates top YouTube courses and GitHub repositories by topic. 
            Every resource is connected to a live room so you can study together, share code, and unblock errors.
          </p>

          {/* Search Bar - Hero Component */}
          <div className="w-full max-w-2xl bg-base-100 p-2 rounded-2xl border border-base-300 shadow-md">
            <SearchAutocomplete
              placeholder="What skill do you want to learn? (e.g. react, dsa, rust)..."
              buttonText="Search"
              showButton={true}
              inputClassName="input-md text-sm border-0 focus:outline-hidden bg-transparent"
            />
          </div>

          {/* Popular Topics Row */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-base-content/60 mr-1">Popular:</span>
            {POPULAR_TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                to={`/courses/${topic.slug}`}
                className="badge badge-sm badge-outline hover:badge-primary font-mono text-xs py-2 px-2.5 transition-colors"
              >
                /{topic.slug}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. How It Works - Honest 3-step explanation */}
      <section className="py-16 md:py-20 border-b border-base-300">
        <div className="w-11/12 max-w-6xl mx-auto px-4">
          <div className="max-w-xl text-left mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Workflow</h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              How SkillPick works
            </h3>
            <p className="text-sm text-base-content/70 mt-2">
              A straightforward path from searching a skill to solving blockers with peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-base-200 border border-base-300 p-6 rounded-2xl text-left">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h4 className="text-base font-bold text-base-content mb-1.5">Search by Topic or Query</h4>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Type any programming concept, creator, or technology. Our two-layer index matches verified topics or scans courses and repositories.
              </p>
            </div>

            <div className="card bg-base-200 border border-base-300 p-6 rounded-2xl text-left">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h4 className="text-base font-bold text-base-content mb-1.5">Learn from Verified Materials</h4>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Access official YouTube course playlists and starred GitHub repositories directly. No paywalls, no scraped previews, and no hidden subscriptions.
              </p>
            </div>

            <div className="card bg-base-200 border border-base-300 p-6 rounded-2xl text-left">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h4 className="text-base font-bold text-base-content mb-1.5">Discuss in Study Rooms</h4>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Every course is tied to a real-time room. Ask questions on specific timestamps, share Git repos, and exchange direct messages with active learners.
              </p>
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
                  className="card bg-base-100 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl transition-all group text-left"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 rounded-xl bg-base-200 group-hover:bg-primary group-hover:text-primary-content transition-colors">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                      {platform.name}
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
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Learning Paths */}
      <section className="py-16 md:py-20">
        <div className="w-11/12 max-w-6xl mx-auto px-4">
          <div className="text-left mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Curriculum</h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Featured skill paths
            </h3>
            <p className="text-sm text-base-content/70 mt-1">
              Popular sequences curated by students for interview readiness and production skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_PATHS.map((path) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.slug}
                  className="card bg-base-200 border border-base-300 p-6 rounded-2xl flex flex-col justify-between text-left"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-3 text-primary">
                      <Icon className="size-5" strokeWidth={1.5} />
                      <h4 className="text-base font-bold text-base-content">{path.topic}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-4">
                      {path.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-base-300 flex items-center justify-between">
                    <div className="flex gap-1">
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

      {/* Modal Check */}
      {showWarningModal && (
        <WarningModal onClose={() => setShowWarningModal(false)} />
      )}
    </div>
  );
};

export default Home;
