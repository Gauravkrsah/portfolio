import { 
  createProject, 
  createBlogPost, 
  createOtherWork, 
  createContent
,
  initializeDatabase
} from './supabaseService';
import type { Project, BlogPost, OtherWork, Content } from './supabaseClient';
import { initializeSubscribersTable } from './initializeSubscribersTable';
import { initializeMeetingsTable } from './initializeMeetingsTable';

// Demo projects data
const demoProjects: Omit<Project, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform built with React, Node.js, and MongoDB",
    content: `
      # E-Commerce Platform

      ## Overview
      A comprehensive e-commerce solution that provides businesses with a modern, responsive online store. The platform includes product management, shopping cart functionality, secure checkout, and order tracking.

      ## Technologies Used
      - React for the frontend
      - Node.js and Express for the backend
      - MongoDB for data storage
      - Stripe for payment processing
      - AWS S3 for image storage

      ## Key Features
      - Responsive design for all devices
      - Advanced product filtering and search
      - User authentication and profiles
      - Admin dashboard for inventory management
      - Order processing and tracking
      - Analytics and reporting
    `,
    image_url: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
    github_url: "https://github.com/example/ecommerce-platform",
    live_url: "https://ecommerce-demo.example.com",
    technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    featured: true,
    status: "Published" as const
  },
  {
    title: "AI-Powered Content Generator",
    description: "An application that uses machine learning to generate content based on user prompts",
    content: `
      # AI-Powered Content Generator

      ## Overview
      This application leverages advanced natural language processing models to generate high-quality content based on user prompts. It can create blog posts, product descriptions, marketing copy, and more.

      ## Technologies Used
      - Python for backend processing
      - TensorFlow and PyTorch for ML models
      - React for the frontend interface
      - FastAPI for API endpoints
      - Docker for containerization

      ## Key Features
      - Multiple content types and styles
      - Customizable tone and voice
      - SEO optimization suggestions
      - Content editing and refinement tools
      - Export to various formats
    `,
    image_url: "https://images.unsplash.com/photo-1677442135136-760c813a6f14?auto=format&fit=crop&w=800&q=80",
    github_url: "https://github.com/example/ai-content-generator",
    live_url: "https://ai-content.example.com",
    technologies: ["Python", "TensorFlow", "React", "FastAPI", "Docker"],
    featured: true,
    status: "Published" as const
  },
  {
    title: "Mobile Fitness Tracker",
    description: "A React Native app that helps users track their fitness goals and progress",
    content: `
      # Mobile Fitness Tracker

      ## Overview
      A comprehensive fitness tracking application built with React Native that allows users to set goals, track workouts, monitor nutrition, and visualize progress over time.

      ## Technologies Used
      - React Native for cross-platform mobile development
      - Firebase for backend and authentication
      - Redux for state management
      - D3.js for data visualization
      - Google Fit and Apple HealthKit integration

      ## Key Features
      - Personalized workout plans
      - Nutrition and meal tracking
      - Progress visualization with charts
      - Social sharing and challenges
      - Wearable device integration
      - Offline functionality
    `,
    image_url: "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80",
    github_url: "https://github.com/example/fitness-tracker",
    live_url: "https://fitnessapp.example.com",
    technologies: ["React Native", "Firebase", "Redux", "D3.js", "HealthKit"],
    featured: true,
    status: "Published" as const
  }
];

// Demo blog posts data
const demoBlogPosts: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Building Scalable Web Applications with Next.js",
    summary: "Learn how to build performant and scalable web applications using Next.js and React...",
    content: `
      # Building Scalable Web Applications with Next.js

      Next.js has emerged as one of the most popular frameworks for building React applications. Its server-side rendering capabilities, static site generation, and built-in API routes make it an excellent choice for scalable web applications.

      ## Why Next.js?

      Next.js solves many common challenges in modern web development:

      - **Performance**: Server-side rendering and static generation improve loading times and SEO
      - **Developer Experience**: Hot reloading, file-based routing, and built-in TypeScript support
      - **Scalability**: Automatic code splitting, optimized bundling, and incremental static regeneration
      - **Deployment**: Easy deployment with Vercel or other hosting providers

      ## Key Features for Scalability

      ### 1. Hybrid Rendering

      Next.js allows you to choose the rendering method on a per-page basis:

      - **Static Generation (SSG)**: Pre-render pages at build time
      - **Server-Side Rendering (SSR)**: Generate HTML on each request
      - **Incremental Static Regeneration (ISR)**: Update static pages after deployment

      ### 2. API Routes

      Next.js provides a solution for building API endpoints as part of your application:

      \`\`\`javascript
      // pages/api/users.js
      export default function handler(req, res) {
        res.status(200).json({ users: ['John', 'Jane'] })
      }
      \`\`\`

      ### 3. Image Optimization

      The built-in Image component automatically optimizes images for different devices:

      \`\`\`jsx
      import Image from 'next/image'

      function ProfileImage() {
        return (
          <Image
            src="/profile.jpg"
            width={300}
            height={300}
            alt="Profile"
          />
        )
      }
      \`\`\`

      ## Best Practices for Scalable Applications

      1. **Use TypeScript** for type safety and better developer experience
      2. **Implement proper data fetching** strategies using SWR or React Query
      3. **Optimize components** with React.memo and useMemo
      4. **Set up a good folder structure** to organize your code
      5. **Implement proper error handling** for API routes and data fetching

      By following these practices and leveraging Next.js features, you can build web applications that scale to millions of users while maintaining excellent performance and developer experience.
    `,
    image_url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    author: "Jane Developer",
    categories: ["Web Development", "React", "Next.js"],
    tags: ["javascript", "react", "nextjs", "performance", "scalability"],
    featured: true,
    status: "Published" as const
  },
  {
    title: "Machine Learning in Production: Best Practices",
    summary: "A comprehensive guide to deploying and maintaining ML models in production environments...",
    content: `
      # Machine Learning in Production: Best Practices

      Deploying machine learning models to production is challenging. Unlike traditional software, ML systems involve data pipelines, model training, monitoring, and continuous updates. This guide covers best practices for successfully deploying ML models in production.

      ## The ML Production Lifecycle

      ### 1. Data Pipeline Management

      - **Version your datasets**: Use tools like DVC or Pachyderm
      - **Automate data validation**: Check for schema drift and data quality issues
      - **Implement data lineage tracking**: Know where your data comes from and how it's transformed

      ### 2. Model Training and Evaluation

      - **Use experiment tracking**: Tools like MLflow or Weights & Biases
      - **Implement CI/CD for ML**: Automate testing and deployment
      - **Standardize evaluation metrics**: Ensure consistent model comparison

      ### 3. Model Serving

      \`\`\`python
      # Example using TensorFlow Serving
      import tensorflow as tf
      
      model = tf.keras.models.load_model('model.h5')
      tf.saved_model.save(model, 'serving/model/1/')
      \`\`\`

      - **Consider different serving patterns**:
        - Batch prediction for non-time-sensitive applications
        - Real-time serving for immediate predictions
        - Edge deployment for low-latency requirements

      ### 4. Monitoring and Maintenance

      - **Track prediction drift**: Monitor how predictions change over time
      - **Set up performance alerts**: Be notified when model performance degrades
      - **Implement shadow deployments**: Test new models alongside existing ones

      ## Infrastructure Considerations

      ### Containerization and Orchestration

      Docker and Kubernetes have become standard tools for deploying ML systems:

      \`\`\`dockerfile
      FROM python:3.9-slim
      
      WORKDIR /app
      COPY requirements.txt .
      RUN pip install -r requirements.txt
      
      COPY . .
      
      EXPOSE 8000
      CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
      \`\`\`

      ### Scalability

      - Use horizontal scaling for prediction services
      - Implement caching for frequent predictions
      - Consider serverless architectures for variable workloads

      ## Case Study: Recommendation System

      A large e-commerce company implemented these practices for their recommendation system:

      1. **Data pipeline**: Automated ETL processes with Airflow
      2. **Model training**: Weekly retraining with A/B testing
      3. **Serving**: Real-time API with TensorFlow Serving
      4. **Monitoring**: Custom dashboard tracking recommendation quality

      The result was a 35% improvement in recommendation relevance and a 20% reduction in infrastructure costs.

      By following these best practices, you can build ML systems that are reliable, scalable, and maintainable in production environments.
    `,
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    author: "Alex Data",
    categories: ["Machine Learning", "DevOps", "Data Science"],
    tags: ["machine learning", "mlops", "production", "deployment", "monitoring"],
    featured: true,
    status: "Published" as const
  }
];

// Demo other works data
const demoOtherWorks: Omit<OtherWork, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "UI/UX Redesign for Financial App",
    description: "Complete redesign of a financial management application focusing on user experience and accessibility",
    content: `
      # UI/UX Redesign for Financial App

      ## Project Overview
      
      This project involved a comprehensive redesign of a financial management application used by over 50,000 users. The goal was to improve user experience, increase engagement, and enhance accessibility while maintaining the app's core functionality.

      ## Challenge

      The original application suffered from several issues:
      
      - Cluttered interface with poor information hierarchy
      - Inconsistent design patterns across different sections
      - Low accessibility scores, particularly for color contrast
      - Complex workflows requiring too many steps
      - Poor mobile responsiveness

      ## Approach

      ### Research Phase
      
      - Conducted user interviews with 25 existing customers
      - Analyzed user behavior through heatmaps and session recordings
      - Performed competitive analysis of 5 leading financial apps
      - Created user personas and journey maps

      ### Design Process
      
      - Developed a new design system with consistent components
      - Created low-fidelity wireframes for key user flows
      - Built interactive prototypes for user testing
      - Iterated based on feedback from stakeholders and users
      - Finalized high-fidelity designs with accessibility in mind

      ## Results
      
      The redesigned application achieved:
      
      - 40% increase in daily active users
      - 25% reduction in task completion time
      - 98% WCAG 2.1 AA compliance score
      - 30% decrease in support tickets related to UI confusion
      - Positive feedback from 90% of surveyed users

      ## Tools Used
      
      - Figma for design and prototyping
      - Maze for user testing
      - Zeplin for developer handoff
      - Stark for accessibility checking
    `,
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    work_type: "UI/UX Design",
    client: "FinTech Inc.",
    technologies: ["Figma", "Sketch", "Adobe XD", "Zeplin"],
    featured: true,
    status: "Published" as const
  }
];

// Demo video content data
const demoVideos: Omit<Content, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: "Introduction to React Hooks",
    description: "Learn the basics of React Hooks and how they can simplify your React components",
    content_url: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
    thumbnail_url: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80",
    content_type: "Tutorial",
    is_video: true,
    platform: "YouTube",
    likes: 1250,
    comments: 85,
    shares: 320,
    views: 15000,
    featured: true,
    status: "Published" as const
  }
];

/**
 * Initialize the database with demo data
 */
export const initializeDemoData = async () => {
  try {
    console.log("Starting demo data initialization...");
    
    // Add demo projects
    console.log("Adding demo projects...");
    for (const project of demoProjects) {
      await createProject(project);
    }
    
    // Add demo blog posts
    console.log("Adding demo blog posts...");
    for (const blogPost of demoBlogPosts) {
      await createBlogPost(blogPost);
    }
    
    // Add demo other works
    console.log("Adding demo other works...");
    for (const otherWork of demoOtherWorks) {
      await createOtherWork(otherWork);
    }
    
    // Add demo videos
    console.log("Adding demo videos...");
    for (const video of demoVideos) {
      await createContent(video);
    }

    // Initialize subscribers and meetings tables
    console.log("Initializing subscribers and meetings tables...");
    await initializeSubscribersTable();
    await initializeMeetingsTable();
    
    // Make sure database is properly initialized
    await initializeDatabase();
    
    console.log("Demo data initialization completed successfully!");
    return true;
  } catch (error) {
    console.error("Error initializing demo data:", error);
    return false;
  }
};