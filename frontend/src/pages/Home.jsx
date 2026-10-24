import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  GitBranch, 
  ArrowRight, 
  Video 
} from 'lucide-react';
import SearchAutocomplete from '../Components/SearchAutocomplete';
import WarningModal from '../Components/WarningModal';
import HeadlineReveal from '../Components/motion/HeadlineReveal';
import Marquee from '../Components/motion/Marquee';
import ScrollTimeline from '../Components/motion/ScrollTimeline';
import StatsRow from '../Components/motion/StatsRow';
import ButtonArrow from '../Components/motion/ButtonArrow';
import { getHomeStats } from '../operations/apiConnectors';

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

const QUICK_SUGGESTIONS = [
  { label: "react", query: "react" },
  { label: "dsa", query: "dsa" },
  { label: "python", query: "python" },
  { label: "system-design", query: "system-design" },
  { label: "javascript", query: "javascript" },
  { label: "nextjs", query: "nextjs" },
  { label: "nodejs", query: "nodejs" },
  { label: "docker", query: "docker" },
  { label: "typescript", query: "typescript" },
  { label: "kubernetes", query: "kubernetes" },
  { label: "golang", query: "golang" },
  { label: "sql", query: "sql" },
  { label: "machine-learning", query: "machine-learning" },
  { label: "git", query: "git" },
  { label: "cpp", query: "c-plus-plus" }
];

const TIMELINE_STEPS = [
  {
    number: "01",
    title: "Search by Topic or Query",
    label: "30 SECONDS",
    description: "Type any programming concept, technology, or framework. The dual-layer search matches verified topic hubs or scans resources instantly.",
    tags: ["AUTOCOMPLETE", "FUZZY SEARCH", "TOPIC INDEX"]
  },
  {
    number: "02",
    title: "Pick a Course or Repo",
    label: "1 MINUTE",
    description: "Access structured YouTube courses and cloneable GitHub repositories. No paywalls, no scraped previews, and no spam.",
    tags: ["YOUTUBE PLAYLISTS", "GITHUB REPOS", "16:9 PREVIEWS"]
  },
  {
    number: "03",
    title: "Join its Room & Study",
    label: "INSTANT",
    description: "Every resource connects directly to a live room. Ask questions, exchange code snippets, and solve bugs together with fellow learners.",
    tags: ["LIVE CHAT", "DIRECT MESSAGES", "PEER DISCUSSION"]
  },
  {
    number: "04",
    title: "Add What's Missing",
    label: "2 MINUTES",
    description: "Found a great course elsewhere? Submit any external tutorial, Udemy course, or GitHub repo. It auto-tags to the topic and generates an instant room.",
    tags: ["COMMUNITY SUBMISSIONS", "AUTO-TAGGING", "INSTANT ROOM"]
  }
];

const PLATFORMS = [
  {
    name: "YouTube",
    title: "Structured Video Playlists",
    desc: "Curated end-to-end courses and playlists from proven developer practitioners, structured by difficulty and duration.",
    route: "/Platform/YouTube",
    icon: Video,
    badge: "Free Courses"
  },
  {
    name: "GitHub",
    title: "Open Source Codebases",
    desc: "Production repos, developer roadmaps, and starter architectures to clone, inspect, and practice what you watch.",
    route: "/Platform/GitHub",
    icon: GitBranch,
    badge: "Code & Repos"
  },
  {
    name: "Community",
    title: "Peer-Submitted Resources",
    desc: "External course links, Udemy/Coursera tutorials, and documentation verified and voted by active learners.",
    route: "/Platform/Community",
    icon: MessageSquare,
    badge: "Community Added"
  }
];

const BUILT_WITH_TECH = [
  { text: "React 19" },
  { text: "Node.js" },
  { text: "Express" },
  { text: "MongoDB Atlas" },
  { text: "Socket.IO" },
  { text: "YouTube Data API v3" },
  { text: "GitHub REST API" },
  { text: "Tailwind CSS v4" },
  { text: "daisyUI v5" }
];

const Home = () => {
  const navigate = useNavigate();
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenModal");
    if (!hasSeenModal) {
      setShowWarningModal(true);
      sessionStorage.setItem("hasSeenModal", "true");
    }

    // Fetch real platform stats
    const fetchStats = async () => {
      const data = await getHomeStats();
      if (data?.success) {
        setStats(data);
      }
    };
    fetchStats();
  }, []);

  // Marquee 1 Items: real popular topics from API, falling back to seeded topics
  const topicMarqueeItems = (stats?.popularTopics && stats.popularTopics.length > 0)
    ? stats.popularTopics.map(t => ({ text: t.name, href: `/courses/${t.slug}` }))
    : POPULAR_TOPICS.map(t => ({ text: t.name, href: `/courses/${t.slug}` }));

  return (
    <div className="min-h-screen bg-base-100 flex flex-col overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 border-b border-base-300 bg-base-100">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20 bg-[radial-gradient(circle,#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" 
          aria-hidden="true"
        />

        <div className="relative w-11/12 max-w-5xl mx-auto px-4 text-center space-y-7">
          
          {/* Eyebrow Label */}
          <div className="flex justify-center">
            <span className="motion-eyebrow">
              00 // OPEN STUDENT LEARNING STACK
            </span>
          </div>

          {/* HeadlineReveal: Masked slide-up on each line */}
          <HeadlineReveal
            lines={[
              "Learning is not just watching videos.",
              "It is code, practice, and community."
            ]}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-base-content leading-[1.12] max-w-4xl mx-auto"
          />

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-base-content/75 leading-relaxed max-w-2xl mx-auto">
            SkillPick integrates structured YouTube courses, starred GitHub repositories, and real-time study rooms into a single cohesive learning system.
          </p>

          {/* Search Bar - Untouched Logic, Hero Focal Point */}
          <div className="w-full max-w-2xl mx-auto pt-2">
            <SearchAutocomplete
              placeholder="Search by skill, language, or concept (e.g. react, dsa, rust)..."
              buttonText="Search"
              showButton={true}
            />

            {/* Quick Prompt Pills (Expanded suggestions) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-base-content/60 pt-3 max-w-3xl mx-auto">
              <span className="font-mono text-[11px] text-base-content/50 shrink-0">try:</span>
              {QUICK_SUGGESTIONS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(`/courses/${item.query}`)}
                  className="px-2.5 py-0.5 rounded-md bg-base-200/60 hover:bg-primary/10 border border-base-300/80 hover:border-primary/50 text-base-content/75 hover:text-primary transition-all font-mono text-[11px] cursor-pointer"
                >
                  /{item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Real Data StatsRow (Counts up once over 800ms when visible; hides if data missing) */}
          {stats && <StatsRow stats={stats} />}

        </div>
      </section>

      {/* 2. Marquee 1: Popular Topics Right Now (Direction Left) */}
      <Marquee
        label="POPULAR TOPICS RIGHT NOW"
        items={topicMarqueeItems}
        direction="left"
        speed={45}
        pauseOnHover={true}
      />

      {/* 3. ScrollTimeline: How it works */}
      <ScrollTimeline
        eyebrow="HOW IT WORKS"
        heading="From search to unblocked in minutes."
        intro="A straightforward path from discovering a course to solving errors with peers in real-time rooms."
        steps={TIMELINE_STEPS}
      />

      {/* 4. Platforms & Curriculum Tracks */}
      <section className="py-20 md:py-28 border-b border-base-300 bg-base-200/30">
        <div className="w-11/12 max-w-6xl mx-auto px-4 text-left">
          
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="motion-eyebrow">
              SOURCES
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

      {/* 5. Marquee 2: Built With (Direction Right) */}
      <Marquee
        label="BUILT WITH"
        items={BUILT_WITH_TECH}
        direction="right"
        speed={55}
        pauseOnHover={true}
      />

      {/* 6. Community Protocol Callout */}
      <section className="py-16 bg-base-200/50">
        <div className="w-11/12 max-w-4xl mx-auto px-4">
          <div className="card bg-base-100 border border-base-300 p-8 sm:p-10 rounded-2xl shadow-xs text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="motion-eyebrow">
                COMMUNITY PROTOCOL
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight">
                Found a course that isn't on SkillPick?
              </h3>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                Paste any YouTube link, Udemy course, or GitHub repository. Our pipeline auto-tags it to the topic hierarchy and generates an instant study room.
              </p>
            </div>
            <ButtonArrow
              to="/courses/react"
              className="shrink-0 px-5"
            >
              Add Resource
            </ButtonArrow>
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
