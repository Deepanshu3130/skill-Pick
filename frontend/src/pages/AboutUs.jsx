import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  ShieldCheck, 
  MessageSquare, 
  Code
} from 'lucide-react';
import TextReveal from '../Components/motion/TextReveal';
import StickyScrollSection from '../Components/motion/StickyScrollSection';
import StackingCards from '../Components/motion/StackingCards';
import FaqAccordion from '../Components/motion/FaqAccordion';
import ButtonArrow from '../Components/motion/ButtonArrow';

// Story milestones with clearly marked TODO placeholders
const STORY_BLOCKS = [
  {
    number: "01",
    label: "THE PROBLEM",
    title: "Fragmented Developer Learning",
    /* TODO: user edit - Replace with author's personal narrative on fragmented tutorials */
    content: "Developer tutorials are scattered across paywalled platforms, isolated YouTube playlists, and chaotic forums without structured study tracks or real-time peer discussion.",
    tags: ["SCATTERED RESOURCES", "PAYWALLS", "ISOLATION"]
  },
  {
    number: "02",
    label: "THE IDEA",
    title: "Topic Hubs + Instant Study Rooms",
    /* TODO: user edit - Replace with author's origin story on conceiving SkillPick */
    content: "The concept was straightforward: organize developer learning into topic hierarchies backed by official APIs, pairing every single resource with an instant peer study room.",
    tags: ["OFFICIAL APIS", "COMMUNITY ROOMS", "TAXONOMY"]
  },
  {
    number: "03",
    label: "THE BUILD",
    title: "Engineered on Open Protocols",
    /* TODO: user edit - Replace with author's technical journey building the MERN + Socket stack */
    content: "Built on React, Node.js, Express, MongoDB Atlas, and Socket.IO. We eliminated web scraping entirely in favor of official YouTube and GitHub APIs and community-moderated submissions.",
    tags: ["REACT", "SOCKET.IO", "MONGODB ATLAS", "OFFICIAL APIS"]
  },
  {
    number: "04",
    label: "WHAT'S NEXT",
    title: "Learner-Driven Curriculum",
    /* TODO: user edit - Replace with author's roadmap for upcoming features and open-source goals */
    content: "Expanding community-curated tracks, enhanced live code snippet sharing in study rooms, and deeper open-source repository integration for collaborative student projects.",
    tags: ["CURRICULUM TRACKS", "CODE SHARING", "OPEN SOURCE"]
  }
];

// The 3 core principles with exact existing copy
const PRINCIPLES = [
  {
    number: "01",
    title: "Official APIs Only",
    badge: "Architecture",
    text: "Zero web scraping. All content is fetched strictly through official YouTube Data API v3 and GitHub REST API endpoints.",
    tags: ["YOUTUBE API V3", "GITHUB REST API", "ZERO SCRAPING"]
  },
  {
    number: "02",
    title: "Free & Paywall-Free",
    badge: "Philosophy",
    text: "Curated open courses and starred open-source roadmaps. No subscriptions, affiliate traps, or scraped partial content.",
    tags: ["100% FREE", "NO PAYWALLS", "OPEN ACCESS"]
  },
  {
    number: "03",
    title: "Connected Study Rooms",
    badge: "Community",
    text: "Every course has a real-time study chat powered by Socket.IO where learners ask questions, solve bugs, and collaborate.",
    tags: ["SOCKET.IO", "REAL-TIME CHAT", "PEER UNBLOCKING"]
  }
];

// Verified FAQ questions and answers
const FAQ_ITEMS = [
  {
    question: "How does SkillPick source its courses and repositories?",
    answer: "All resources are fetched strictly through official public APIs—the YouTube Data API v3 for structured video playlists and comprehensive courses, and the GitHub REST API for developer repositories and roadmaps. Zero web scraping or unofficial crawlers are used."
  },
  {
    question: "Can I submit a course or repository that is missing?",
    answer: "Yes. Use the \"Can't find your course?\" panel to submit any YouTube playlist or GitHub repository. Submissions undergo offline format validation and official API verification with automatic whole-word topic tagging."
  },
  {
    question: "How does community resource moderation work?",
    answer: "Newly submitted community resources remain visible to their submitter until receiving 3 community upvotes. Once reaching the 3-upvote threshold, the resource graduates automatically into public topic recommendations for all learners."
  },
  {
    question: "How do the connected study rooms work?",
    answer: "Every approved course and repository generates a dedicated real-time study room powered by Socket.IO. Authenticated students can ask questions, exchange code snippets, and solve bugs together in real time."
  },
  {
    question: "Is SkillPick free to use?",
    answer: "Yes. All indexed YouTube courses, GitHub repositories, and community study rooms are 100% free with zero paywalls or mandatory subscriptions."
  }
];

function AboutUs() {
  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16 flex flex-col">
      <div className="w-11/12 max-w-5xl mx-auto px-4 text-left space-y-4 mb-8">
        
        {/* Header Kicker & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-200 border border-base-300 text-xs font-medium text-base-content/80 mb-2">
          <Code className="size-3.5 text-primary" strokeWidth={1.5} />
          <span>Open Learning Community</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-base-content">
          About SkillPick
        </h1>
        <p className="text-sm sm:text-base text-base-content/70 max-w-2xl leading-relaxed">
          SkillPick was created to eliminate fragmented learning. Instead of jumping between paywalled platforms, scattered video playlists, and unhelpful comment sections, we organize resources around topics with peer study rooms.
        </p>
      </div>

      {/* Pattern 1: TextReveal (Mission Statement) */}
      <TextReveal
        eyebrow="MISSION"
        text="SkillPick organizes developer resources around topic hierarchies with real-time peer study rooms."
      />

      {/* Pattern 2: StickyScrollSection (The Story) */}
      <StickyScrollSection
        eyebrow="THE JOURNEY"
        heading="From fragmented tutorials to a unified learning stack."
        intro="The milestones behind building an open, paywall-free student platform."
        blocks={STORY_BLOCKS}
      />

      {/* Pattern 3: StackingCards (Our Principles) */}
      <StackingCards
        eyebrow="FOUNDATIONS"
        heading="Our Core Principles"
        intro="Three foundational engineering rules that guide every feature we build."
        items={PRINCIPLES}
      />

      {/* Existing Block: How Topics and Resources are Organized */}
      <section className="py-16 md:py-20 border-b border-base-300">
        <div className="w-11/12 max-w-4xl mx-auto px-4 text-left">
          <div className="card bg-base-100 border border-base-300 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xs">
            <div className="space-y-1">
              <span className="motion-eyebrow">TAXONOMY PIPELINE</span>
              <h2 className="text-xl sm:text-2xl font-bold text-base-content">
                How topics and resources are organized
              </h2>
            </div>

            <ul className="space-y-4 text-xs sm:text-sm text-base-content/80">
              <li className="flex items-start gap-3">
                <span className="font-mono text-primary font-bold">1.</span>
                <div>
                  <strong>Two-Layer Search:</strong> Topics power typing suggestions and hierarchical links (e.g. <code>react</code> part of <code>web-development</code>). Full courses and repos are searched simultaneously across titles, descriptions, and creators.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-primary font-bold">2.</span>
                <div>
                  <strong>Community Submissions:</strong> Missing a course? Paste any link via "Can't find your course?". It runs through offline validation and official API verification with automatic whole-word topic tagging.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-mono text-primary font-bold">3.</span>
                <div>
                  <strong>Student Moderation:</strong> Submissions are verified and upvoted by community members. Resources with 3+ upvotes graduate immediately into public topic recommendations.
                </div>
              </li>
            </ul>

            <div className="pt-2">
              <ButtonArrow to="/explore">
                Start exploring topics
              </ButtonArrow>
            </div>
          </div>
        </div>
      </section>

      {/* Pattern 4: FaqAccordion (Verified Questions & Answers) */}
      <FaqAccordion
        eyebrow="FREQUENTLY ASKED QUESTIONS"
        heading="Platform & Architecture FAQ"
        intro="Verified answers on API integrations, submission verification, and community study rooms."
        items={FAQ_ITEMS}
      />

    </div>
  );
}

export default AboutUs;
