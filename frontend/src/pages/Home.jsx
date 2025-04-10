import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiUsers, FiMessageSquare, FiBookOpen, FiAward, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import  { useState } from "react";
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import ActiveUsers from '../Components/ActiveUsers';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import WarningModal from '../Components/WarningModal';
 
const Home = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);  
  useEffect(() => {
    const hasSeenModal = sessionStorage.getItem("hasSeenModal");

    if (!hasSeenModal) {
      setShowWarningModal(true);
      sessionStorage.setItem("hasSeenModal", "true");
    }
  }, []);
  const features = [
    {
      icon: <FiSearch className="text-3xl" />,
      title: "Unified Course Discovery",
      description: "One search to find the best courses from all major platforms"
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: "Learning Circles",
      description: "Join topic-specific communities of passionate learners"
    },
    {
      icon: <FiMessageSquare className="text-3xl" />,
      title: "Peer Networking",
      description: "Connect directly with others on the same learning path"
    },
    {
      icon: <FiBookOpen className="text-3xl" />,
      title: "Progress Tracking",
      description: "Central dashboard for all your learning activities"
    },
    {
      icon: <FiAward className="text-3xl" />,
      title: "Skill Validation",
      description: "Earn verifiable credentials for completed courses"
    }
  ];

  const platformStats = [
    {
      name: "Udemy",
      courses: "210,000+",
      highlight: "Most comprehensive course library",
      logo: "/udemy-logo.png"
    },
    {
      name: "Coursera",
      courses: "5,000+",
      highlight: "University-certified programs",
      logo: "/coursera-logo.webp"
    },
    {
      name: "YouTube",
      courses: "Millions",
      highlight: "Free learning resources",
      logo: "/youtube-logo.jpg" 
    }
  ];
  // // const platformLogos = [
  // //   { name: "Udemy", logo: "/udemy-logo.png" },
  // //   { name: "Coursera", logo: "/coursera-logo.webp" },
  // //   { name: "YouTube", logo: "/youtube-logo.jpg" },
   
  // ];
  const handlePlatform = (input) => {
     navigate(`/Platform/${input}`);
  }
  const learningOutcomes = [
    {
      metric: "87%",
      title: "Completion Rate",
      description: "Higher than industry average thanks to our community support system"
    },
    {
      metric: "4.8/5",
      title: "Average Rating",
      description: "Courses curated and vetted by our team of learning experts"
    },
    {
      metric: "3x",
      title: "Faster Skill Acquisition",
      description: "Learners report faster progress with our guided pathways"
    }
  ];
  const handleCourse = (input) => {
    // Handle course selection logic here
    navigate(`/courses/${input}`);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/courses/${input}`);
  };
  return (
    <div className="bg-base-100 w-full">


      {/* Hero Section */}
      <section className="hero bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 min-h-[80vh]  mt-4 lg:mt-0">
        <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-6 py-12 gap-12 sm-min-w-[320px]">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 relative"
          >
            <div className="mockup-browser border bg-base-200 shadow-xl  ">
              <div className="mockup-browser-toolbar">
                <div className="input bg-base-200">skill-pick.in</div>
              </div>
              <img src='/hero.png '
                alt="Hero"
                className="w-full  object-cover rounded-lg lg:hidden max-h-[500px] "
              />
             <div className="hidden lg:block w-full h-full">
             <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                breakpoints={{
                      320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                      },
                      640: {
                        slidesPerView: 1,
                        spaceBetween: 15,
                      },
                      1024: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                      },
                    }}
                    className="w-full aspect-[16/9] max-h-[400px] "
              >
                <SwiperSlide>
                  <img src="/hero2.png" alt="Slide 1" className="w-full h-full object-cover rounded-lg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/hero3.png" alt="Slide 2" className="w-full h-full object-cover rounded-lg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/hero4.png" alt="Slide 3" className="w-full h-full object-cover rounded-lg" />
                </SwiperSlide>
                <SwiperSlide>
                  <img src="/hero5.png" alt="Slide 3" className="w-full h-full object-cover rounded-lg" />
                </SwiperSlide>
              </Swiper>

             </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-content p-4 rounded-xl shadow-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <FiUsers className="text-2xl" />
                <div>
                <ActiveUsers></ActiveUsers>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="lg:w-1/2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
            >
              The <span className="text-primary">Smart Way</span> to Master New Skills
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl mb-8 text-base-content/80"
            >
              Discover, compare, and track the best courses from top platforms while connecting with a community of learners.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-xl mb-8"
            >
              <form onSubmit={handleSubmit} className="join w-full">
                <input
                  type="text"
                  placeholder="What skill do you want to master today?"
                  className="input input-bordered join-item w-full focus:outline-none text-base-content placeholder:text-base-content/60"
                  value={input}
                 onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-primary join-item">
                  <FiSearch className="mr-2" /> Search
                </button>
              </form>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3"
            >
              <span className="text-sm text-base-content/60">Trending:</span>
              <button onClick={() => handleCourse("web development")}   className="badge badge-lg badge-outline hover:badge-primary transition-all">Web Development</button>
              <button onClick={() => handleCourse("data science")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">Data Science</button>
              <button onClick={() => handleCourse("web design")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">Web Design</button>
             <button onClick={() => handleCourse("machine learning")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">machine learning</button>
             <button onClick={() => handleCourse("artifical intelligence")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">Artifical Intelligence</button>
             <button onClick={() => handleCourse("deep learning")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">Deep learning</button>
             <button onClick={() => handleCourse("android development")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">Android Development</button>
             <button onClick={() => handleCourse("ios development")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">ios Development</button>
             <button onClick={() => handleCourse("AutoCad")}  className="badge badge-lg badge-outline hover:badge-primary transition-all">AutoCad</button>
             <button onClick={() => handleCourse("python")}  className="badge badge-lg badge-outline hover:badge-primary transition-all"> python</button>
             <button onClick={() => handleCourse("data structures")}  className="badge badge-lg badge-outline hover:badge-primary transition-all"> Data Structures</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Logos */}
      <section className="py-20 bg-base-200/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              One Platform, <span className="text-primary">Endless Learning</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-base-content/80 max-w-3xl mx-auto"
            >
              We bring together the best courses from top platforms so you don't have to search multiple sites
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {platformStats.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="card-body items-center text-center p-6">
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="h-16 object-contain mb-4"
                  />
                  <h3 className="card-title text-2xl mb-2">{platform.name}</h3>
                  <p className="text-lg font-semibold text-primary mb-2">{platform.courses} courses</p>
                  <p className="text-base-content/70 mb-4">{platform.highlight}</p>
                  <div className="card-actions justify-center">
                    <button className="btn btn-ghost btn-sm text-primary"
                    onClick={()=>handlePlatform(platform.name)}>
                      Explore 
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg text-primary max-w-3xl mx-auto"
            >
             we are working with more platforms to bring you the best learning experience possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Your Complete <span className="text-primary">Learning Ecosystem</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-base-content/80 max-w-3xl mx-auto"
            >
              We combine course discovery with community support for better learning outcomes
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-sm  border border-base-200/50 hover:scale-105 hover:shadow-md hover:border-primary transition-all duration-300"
              >
                <div className="card-body items-center text-center p-6">
                  <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-lg">{feature.title}</h3>
                  <p className="text-base-content/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="py-20 bg-base-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Measurable <span className="text-primary">Learning Outcomes</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-base-content/80 max-w-3xl mx-auto"
            >
              Our platform is designed to help you achieve real results
            </motion.p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {learningOutcomes.map((outcome, index) => (
              <motion.div
                key={outcome.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-base-100 shadow-sm border border-base-200/50 hover:scale-105 hover:shadow-md hover:border-primary transition-all duration-300"
              >
                <div className="card-body">
                  <div className="text-5xl font-bold text-primary mb-4">{outcome.metric}</div>
                  <h3 className="card-title mb-2">{outcome.title}</h3>
                  <p className="text-base-content/70">{outcome.description}</p>
                </div>
              </motion.div>
            ))}
        </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-content">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Learning Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl mb-8 opacity-90 max-w-2xl mx-auto"
          >
            Join our community of 25,000+ learners and discover the smarter way to build in-demand skills.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button 
               
              className="btn btn-accent btn-lg shadow-md"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Start Learning Free
            </button>
            <Link 
              to="/aboutUs" 
              className="btn btn-outline btn-lg btn-accent text-primary-content hover:text-primary-content"
            >
              How It Works
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm opacity-80"
          >
            <div className="flex items-center gap-2">
              <FiCheckCircle /> No credit card required
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle /> 100% satisfaction guarantee
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle /> Cancel anytime
            </div>
          </motion.div>
        </div>
      </section>
      {showWarningModal && (
        <WarningModal onClose={() => setShowWarningModal(false)} />
      )}
    </div>
  );
};

export default Home;