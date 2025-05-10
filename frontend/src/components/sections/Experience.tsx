
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const experiences = [
  {
    id: 1,
    title: 'Senior ML Engineer',
    company: 'Resonant Inc.',
    period: '2022 - Present',
    description: 'Leading machine learning platform design and implementation while building advanced models for predictive analytics and optimization.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Data Analysis'],
  },
  {
    id: 2,
    title: 'Python Developer',
    company: 'Pure Streamline Inc.',
    period: '2019 - 2021',
    description: 'Developed recommendation systems and machine learning models for predictive analytics.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'NLP'],
  },
  {
    id: 3,
    title: 'Junior Data Scientist',
    company: 'Golden Solutions',
    period: '2017 - 2019',
    description: 'Utilized statistical tools and machine learning algorithms to transform raw data into valuable insights to solve business problems.',
    skills: ['Python', 'Statistical Modeling', 'Data Visualization', 'SQL'],
  },
];

const Experience: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <section 
      id="experience" 
      className="py-10 relative"
      ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
              }
            },
            { threshold: 0.1 }
          );
          observer.observe(el);
        }
      }}
    >
      <div>
        <h2 
          className={cn(
            "text-2xl font-bold tracking-tight text-white mb-6",
            isVisible ? "opacity-100" : "opacity-0 translate-y-4"
          )}
        >
          Experience
        </h2>
        
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div 
              key={exp.id}
              className={cn(
                "bg-[#111] p-4 rounded-lg border border-gray-800 transition-all duration-700",
                isVisible ? "opacity-100" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(exp.id - 1) * 100 + 200}ms` }}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-white">{exp.title}</h3>
                <span className="text-blue-500">{exp.period}</span>
              </div>
              <p className="text-gray-400 mb-2">{exp.company}</p>
              <p className="text-gray-300 text-sm">{exp.description}</p>
              
              {exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {exp.skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="text-xs px-2 py-1 bg-gray-800 rounded-md text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
