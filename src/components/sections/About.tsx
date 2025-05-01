import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
  // Core skills with elegant representation
  const skills = [
    { name: "Design", proficiency: 95 },
    { name: "Development", proficiency: 90 },
    { name: "Marketing", proficiency: 85 }
  ];

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-32 relative overflow-hidden"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* Subtle grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-20" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />

      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <div className="h-0.5 w-12 bg-green-500"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">About Me</h2>
            </div>
            
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                As a multidisciplinary professional working at the intersection of design, development, 
                and marketing, I bring a holistic approach to digital product creation.
              </p>
              
              <p>
                My expertise lies in crafting intuitive user interfaces that not only look beautiful 
                but also function seamlessly. I believe that great design should be invisible, 
                enhancing the user experience without drawing attention to itself.
              </p>
              
              <p>
                When I'm not designing or coding, you'll find me exploring emerging technologies, 
                contributing to open-source projects, and sharing my knowledge through writing and speaking.
              </p>
            </div>
            
            <Link 
              to="/projects" 
              className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors font-medium"
            >
              View my work
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-10 relative"
          >
            {/* Experience timeline */}
            <div className="space-y-2 mb-12">
              <div className="h-0.5 w-12 bg-green-500"></div>
              <h3 className="text-2xl font-bold text-white">Core Skills</h3>
            </div>
            
            <div className="space-y-12">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-medium text-white">{skill.name}</span>
                    <span className="text-gray-400">{skill.proficiency}%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-green-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                      transition={{ duration: 1, delay: 0.3 + index * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key facts */}
            <div className="mt-16 grid grid-cols-3 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-400">5+</div>
                <div className="text-sm text-gray-400 mt-1">Years Experience</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-400">50+</div>
                <div className="text-sm text-gray-400 mt-1">Projects</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-400">30+</div>
                <div className="text-sm text-gray-400 mt-1">Clients</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Minimal quote section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-32 max-w-3xl mx-auto text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-light italic text-white">
            "The best design is invisible. It enhances the experience without drawing attention to itself."
          </blockquote>
          <p className="text-gray-400 mt-4">— Design Philosophy</p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
