
import React from 'react';

interface ExperienceItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ 
  title, 
  company, 
  period, 
  description 
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-medium text-white">{title}</h3>
          <p className="text-gray-400">{company}</p>
        </div>
        <span className="text-blue-400 bg-blue-900/30 px-3 py-0.5 rounded-full text-sm">
          {period}
        </span>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

const ExperienceSection: React.FC = () => {
  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-white mb-6">Experience</h2>
      
      <ExperienceItem 
        title="Senior ML Engineer"
        company="AI Research Lab"
        period="2022 - Present"
        description="Leading machine learning platform development and optimization."
      />
      
      <ExperienceItem 
        title="Python Developer"
        company="Tech Innovations Inc."
        period="2019 - 2022"
        description="Developed data processing pipelines and machine learning models for predictive analytics."
      />
      
      <ExperienceItem 
        title="Junior Data Scientist"
        company="DataSci Solutions"
        period="2017 - 2019"
        description="Analyzed large datasets and built statistical models to solve business problems."
      />
    </section>
  );
};

export default ExperienceSection;
