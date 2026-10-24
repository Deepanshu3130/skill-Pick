import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Terminal, Layers } from 'lucide-react';
import HorizontalCarousel from '../Components/motion/HorizontalCarousel';
import NumberedList from '../Components/motion/NumberedList';
import SpotlightCard from '../Components/motion/SpotlightCard';
import { getHomeStats } from '../operations/apiConnectors';

const POPULAR_FALLBACK = [
  { name: "React", slug: "react" },
  { name: "DSA", slug: "dsa" },
  { name: "Python", slug: "python" },
  { name: "System Design", slug: "system-design" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Docker", slug: "docker" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Machine Learning", slug: "machine-learning" },
];

const TOP_LEVEL_TOPICS = [
  {
    number: "01",
    title: "Web Development",
    slug: "web-development",
    description: "Client and server architectures covering modern JavaScript, React, Node.js, and API engineering.",
    tags: ["REACT", "NODE.JS", "FULL-STACK"]
  },
  {
    number: "02",
    title: "Data Structures & Algorithms",
    slug: "dsa",
    description: "Foundational problem-solving patterns, tree traversal, graph algorithms, and dynamic programming.",
    tags: ["PATTERNS", "LEETCODE", "INTERVIEW-PREP"]
  },
  {
    number: "03",
    title: "DevOps & Cloud Systems",
    slug: "devops",
    description: "Containerization with Docker, orchestration with Kubernetes, CI/CD automation, and Linux systems.",
    tags: ["DOCKER", "KUBERNETES", "CI/CD"]
  },
  {
    number: "04",
    title: "Python Programming",
    slug: "python",
    description: "Core syntax, data processing, backend microservices with FastAPI/Django, and scientific scripting.",
    tags: ["FASTAPI", "AUTOMATION", "SCRIPTING"]
  },
  {
    number: "05",
    title: "Artificial Intelligence & ML",
    slug: "artificial-intelligence",
    description: "Machine learning workflows, deep neural networks, computer vision, and generative model pipelines.",
    tags: ["NEURAL-NETWORKS", "PYTORCH", "DEEP-LEARNING"]
  },
  {
    number: "06",
    title: "Mobile Application Development",
    slug: "mobile-development",
    description: "Cross-platform mobile apps with Flutter and React Native, plus native Android and iOS engineering.",
    tags: ["FLUTTER", "REACT-NATIVE", "MOBILE"]
  },
  {
    number: "07",
    title: "Version Control & Git",
    slug: "git",
    description: "Branching workflows, open-source pull requests, merge conflict resolution, and collaborative Git repos.",
    tags: ["GITHUB", "WORKFLOWS", "COLLABORATION"]
  },
  {
    number: "08",
    title: "Relational & NoSQL Databases",
    slug: "sql",
    description: "Query optimization, indexing strategies, PostgreSQL, MySQL schemas, and MongoDB document models.",
    tags: ["SQL", "MONGODB", "INDEXING"]
  }
];

const FEATURED_DOMAINS = [
  {
    title: "Web Systems",
    slug: "web-development",
    desc: "Frontend state machines, backend microservices, and end-to-end full stack architecture.",
    icon: Code,
    badge: "Core Domain"
  },
  {
    title: "Algorithms & Logic",
    slug: "dsa",
    desc: "Algorithmic thinking, complexity analysis, and technical interview preparation.",
    icon: Terminal,
    badge: "Problem Solving"
  },
  {
    title: "Cloud & Reliability",
    slug: "devops",
    desc: "Container workflows, cluster orchestration, and production release pipelines.",
    icon: Layers,
    badge: "Infrastructure"
  }
];

export function Explore() {
  const [popularTopics, setPopularTopics] = useState(POPULAR_FALLBACK);

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getHomeStats();
      if (data?.popularTopics && data.popularTopics.length > 0) {
        setPopularTopics(data.popularTopics);
      }
    };
    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col pt-24 pb-16">
      
      {/* 1. Header Hero */}
      <div className="w-11/12 max-w-5xl mx-auto px-4 text-left space-y-4 mb-12">
        <span className="motion-eyebrow">
          EXPLORE TAXONOMY
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-base-content leading-tight">
          Find your next skill domain.
        </h1>
        <p className="text-sm sm:text-base text-base-content/75 max-w-2xl leading-relaxed">
          Structured developer disciplines indexed by concepts, curated playlists, and connected study rooms.
        </p>
      </div>

      {/* Pattern 1: HorizontalCarousel (Popular Topics) */}
      <HorizontalCarousel
        eyebrow="TRENDING"
        heading="Popular topics right now"
        intro="Direct links to topic hubs with verified courses, open-source repositories, and study rooms."
        items={popularTopics}
      />

      {/* Pattern 2: SpotlightCard (Up to 3 Featured Domain Tiles) */}
      <section className="py-16 md:py-24 border-b border-base-300">
        <div className="w-11/12 max-w-6xl mx-auto px-4 text-left">
          <div className="mb-10 space-y-2">
            <span className="motion-eyebrow">FEATURED DOMAINS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
              Core Engineering Paths
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              return (
                <Link key={domain.slug} to={`/courses/${domain.slug}`} className="block">
                  <SpotlightCard className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Icon className="size-5" strokeWidth={1.5} />
                        </div>
                        <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                          {domain.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-base-content mb-2 leading-snug group-hover:text-primary transition-colors">
                        {domain.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mb-6">
                        {domain.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-base-300/80 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>Explore domain</span>
                      <ArrowRight className="size-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </SpotlightCard>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pattern 3: NumberedList (Top-Level Topic Hierarchy) */}
      <NumberedList
        eyebrow="DIRECTORY"
        heading="All Topic Hubs"
        intro="Select any programming discipline to access curated video playlists, repositories, and peer discussion."
        items={TOP_LEVEL_TOPICS}
      />

    </div>
  );
}

export default Explore;
