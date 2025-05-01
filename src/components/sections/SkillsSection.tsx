
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';

const SkillBadge = ({ name, delay = 0 }: { name: string; delay?: number }) => {
  return (
    <motion.span 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
    >
      {name}
    </motion.span>
  );
};

const SkillCategory = ({ 
  title, 
  skills, 
  className 
}: { 
  title: string; 
  skills: string[]; 
  className?: string;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref} className={cn("space-y-4", className)}>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <SkillBadge 
            key={skill} 
            name={skill} 
            delay={isInView ? index * 0.1 : 0}
          />
        ))}
      </div>
    </div>
  );
};

const SkillsSection: React.FC = () => {
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true });
  
  const frontendSkills = ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Redux", "Next.js"];
  const backendSkills = ["Node.js", "Express", "Python", "Django", "RESTful APIs", "GraphQL", "MongoDB", "PostgreSQL"];
  const devopsSkills = ["Git", "Docker", "CI/CD", "AWS", "Vercel", "Netlify", "Testing", "Performance Optimization"];
  const aiSkills = ["TensorFlow", "PyTorch", "Machine Learning", "Data Analysis", "NLP", "Computer Vision", "Chatbots"];
  
  return (
    <section ref={sectionRef} className="py-20 container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Skills & Expertise</h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-12 text-center">
          A comprehensive set of technical skills developed over years of professional experience
          and continuous learning.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <SkillCategory title="Frontend Development" skills={frontendSkills} />
        <SkillCategory title="Backend Development" skills={backendSkills} />
        <SkillCategory title="DevOps & Tools" skills={devopsSkills} />
        <SkillCategory title="AI & Machine Learning" skills={aiSkills} />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">Ph.D. in Computer Science</h3>
              <p className="text-gray-600 dark:text-gray-400">Stanford University</p>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">2017</span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">M.S. in Machine Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">MIT</p>
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">2015</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SkillsSection;
