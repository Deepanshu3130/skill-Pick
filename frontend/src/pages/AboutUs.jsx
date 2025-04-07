import React from 'react';
import { Link } from 'react-router-dom';
import { Code, BookOpen, Globe, Shield, Star, Search, Bookmark, Users, Play } from 'lucide-react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-base-100 pt-20">
      {/* Hero Section */}
      <section className="hero bg-base-200 py-16">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold text-primary mb-6">About SKILL-PICK</h1>
            <p className="text-xl">
              Your smart course discovery platform to find the best learning resources
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6">
                SKILL-PICK helps you discover the highest quality courses from multiple platforms 
                in one place, saving you time and helping you make informed learning decisions.
              </p>
              <div className="stats shadow bg-base-200">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Active Learners</div>
                  <div className="stat-value">10,000+</div>
                </div>
                
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Courses</div>
                  <div className="stat-value">500+</div>
                </div>
              </div>
            </div>
            <div className="">
              <img 
                src="hero.png"
                alt="Person learning online" 
                className="rounded-lg shadow-2xl object-cover h-full max-h-[500px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How to Use SKILL-PICK</h2>
          
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-primary text-primary-content p-4 rounded-full">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">1. Search for Courses</h3>
                <p>
                  Use the search bar to find courses by topic, platform, or skill. Our powerful search 
                  aggregates courses from multiple providers to give you comprehensive results.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-secondary text-secondary-content p-4 rounded-full">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. Compare & Save</h3>
                <p>
                  View course details, ratings, and platform information. Bookmark interesting 
                  courses to your list for easy access later.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-accent text-accent-content p-4 rounded-full">
                <Play className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">3. Start Learning</h3>
                <p>
                  Click through to your chosen course platform to enroll and begin your learning 
                  journey. We'll redirect you to the official course page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SKILL-PICK?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body items-center text-center">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="card-title mb-2">Multi-Platform</h3>
                <p>Courses from Udemy, Coursera, YouTube and more in one place.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body items-center text-center">
                <Shield className="w-12 h-12 text-secondary mb-4" />
                <h3 className="card-title mb-2">Verified Reviews</h3>
                <p>Real feedback from learners to help you choose quality courses.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="card-body items-center text-center">
                <Star className="w-12 h-12 text-accent mb-4" />
                <h3 className="card-title mb-2">Personalized</h3>
                <p>Save courses and track your learning progress.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of learners today and find your perfect course
          </p>
          <Link to="/" className="btn btn-secondary btn-lg">
            Browse Courses
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;