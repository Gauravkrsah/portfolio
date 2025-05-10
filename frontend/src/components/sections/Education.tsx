
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const educationData = [
  {
    id: 1,
    degree: "Ph.D. in Computer Science",
    institution: "Western University",
    period: "2020",
    skills: []
  },
  {
    id: 2,
    degree: "M.S. in Machine Learning",
    institution: "Stanford University",
    period: "2016",
    skills: ["Python", "TensorFlow", "PyTorch", "Data Analysis", "Natural Language Processing", "Deep Learning", "ML", "Neural Computing"]
  }
];

const Education: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <section 
      id="education" 
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
          Education & Skills
        </h2>
        
        <div className="space-y-6">
          {educationData.map((edu) => (
            <div 
              key={edu.id}
              className={cn(
                "bg-[#111] p-4 rounded-lg border border-gray-800 transition-all duration-700",
                isVisible ? "opacity-100" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${(edu.id - 1) * 100 + 200}ms` }}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-white">{edu.degree}</h3>
                <span className="text-blue-500">{edu.period}</span>
              </div>
              <p className="text-gray-400 mb-2">{edu.institution}</p>
              
              {edu.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {edu.skills.map((skill) => (
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

export default Education;
