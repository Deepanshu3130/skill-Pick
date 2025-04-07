import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';

const ActiveUsers= () => {
  const [count, setCount] = useState(0);
  const targetCount = 25000;
  const duration = 2; // seconds

  useEffect(() => {
    let start = 0;
    const increment = targetCount / (duration * 60); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        start = targetCount;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, 1000 / 60); // 60fps

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="absolute -bottom-6 -left-6 bg-primary text-primary-content p-4 rounded-xl shadow-lg border border-primary/20 z-10"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          duration: 0.6,
          delay: 0.6,
          type: 'spring',
          stiffness: 200,
          damping: 10
        }}
        className="flex items-center gap-3"
      >
        <div className="bg-primary/20 p-2 rounded-full">
          <FiUsers className="text-2xl" />
        </div>
        <div>
          <p className="text-sm font-medium">Active Learners</p>
          <motion.p 
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            {count.toLocaleString()}+
          </motion.p>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, delay: 0.4 }}
        className="h-1 bg-primary-content/20 mt-2 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 2, delay: 0.4 }}
          className="h-full bg-primary-content/80 rounded-full"
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="text-xs mt-2 opacity-80 text-center"
      >
        skill-pick.in
      </motion.p>
    </motion.div>
  );
};

export default ActiveUsers;