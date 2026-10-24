import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  GitBranch, 
  MessageSquare, 
  ShieldCheck, 
  Terminal, 
  Search, 
  ArrowRight,
  Code
} from 'lucide-react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-base-100 pt-24 pb-16 flex flex-col">
      <div className="w-11/12 max-w-4xl mx-auto px-4 space-y-12 text-left">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-200 border border-base-300 text-xs font-medium text-base-content/80 mb-3">
            <Code className="size-3.5 text-primary" strokeWidth={1.5} />
            <span>Open Learning Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content">
            About SkillPick
          </h1>
          <p className="text-sm sm:text-base text-base-content/70 mt-2 max-w-2xl leading-relaxed">
            SkillPick was created to eliminate fragmented learning. Instead of jumping between paywalled platforms, scattered video playlists, and unhelpful comment sections, we organize resources around topics with peer study rooms.
          </p>
        </div>

        {/* Core Principles */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Our Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="card bg-base-200 border border-base-300 p-5 rounded-2xl space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="size-4" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-sm text-base-content">Official APIs Only</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Zero web scraping. All content is fetched strictly through official YouTube Data API v3 and GitHub REST API endpoints.
              </p>
            </div>

            <div className="card bg-base-200 border border-base-300 p-5 rounded-2xl space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="size-4" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-sm text-base-content">Free & Paywall-Free</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Curated open courses and starred open-source roadmaps. No subscriptions, affiliate traps, or scraped partial content.
              </p>
            </div>

            <div className="card bg-base-200 border border-base-300 p-5 rounded-2xl space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <MessageSquare className="size-4" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-sm text-base-content">Connected Study Rooms</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Every course has a real-time study chat powered by Socket.IO where learners ask questions, solve bugs, and collaborate.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works List */}
        <div className="card bg-base-200 border border-base-300 p-6 sm:p-8 rounded-2xl space-y-5">
          <h2 className="text-base font-bold text-base-content">
            How topics and resources are organized
          </h2>

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
            <Link to="/" className="btn btn-sm btn-primary gap-1 font-semibold rounded-xl">
              <span>Start exploring topics</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
