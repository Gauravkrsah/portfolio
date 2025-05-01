
import { 
  addDoc,
  collection, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";
import { db, clearAllDemoData } from "./firebaseService";
import { toast } from "@/components/ui/use-toast";

// Sample projects data
const sampleProjects = [
  {
    title: "Modern E-commerce Platform",
    description: "A full-stack e-commerce solution with React, Node.js, and Stripe integration.",
    category: "Web Development",
    tags: ["React", "Node.js", "Stripe", "MongoDB"],
    imageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    featured: true,
    link: "/projects/modern-ecommerce",
    githubLink: "https://github.com/username/ecommerce-platform",
    liveDemo: "https://ecommerce-demo.example.com"
  },
  {
    title: "AI-Powered Task Manager",
    description: "A task management application with AI features for smart prioritization and time estimation.",
    category: "AI/ML Projects",
    tags: ["React", "TypeScript", "TensorFlow.js", "Firebase"],
    imageUrl: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    featured: true,
    link: "/projects/ai-task-manager",
    githubLink: "https://github.com/username/ai-task-manager",
    liveDemo: "https://ai-tasks.example.com"
  },
  {
    title: "Responsive Portfolio Template",
    description: "A customizable portfolio template for developers and designers with dark mode support.",
    category: "UI/UX Design",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    imageUrl: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&w=800&q=80",
    status: "Published",
    featured: true,
    link: "/projects/portfolio-template",
    githubLink: "https://github.com/username/portfolio-template",
    liveDemo: "https://portfolio-template.example.com"
  }
];

// Sample blog posts data
const sampleBlogPosts = [
  {
    title: "The Future of Web Development: What to Expect in 2025",
    excerpt: "Exploring upcoming trends and technologies that will shape web development in the coming years.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    tags: ["Web Development", "Future", "Trends"],
    author: "Gaurav Kr Sah",
    readTime: "5 min read",
    readingTime: "5 min read",
    status: "Published",
    featured: true,
    category: "Technology"
  },
  {
    title: "Mastering React Hooks: A Comprehensive Guide",
    excerpt: "Learn how to effectively use React Hooks to simplify your components and improve code reusability.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80",
    tags: ["React", "JavaScript", "Hooks", "Frontend"],
    author: "Gaurav Kr Sah",
    readTime: "7 min read",
    readingTime: "7 min read",
    status: "Published",
    featured: true,
    category: "Programming"
  },
  {
    title: "Building Accessible Web Applications",
    excerpt: "Why accessibility matters and how to implement WCAG guidelines in your web projects.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.",
    imageUrl: "https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?auto=format&fit=crop&w=800&q=80",
    tags: ["Accessibility", "WCAG", "Inclusive Design", "UX"],
    author: "Gaurav Kr Sah",
    readTime: "6 min read",
    readingTime: "6 min read",
    status: "Published",
    featured: true,
    category: "Design"
  }
];

// Sample videos/content data
const sampleVideos = [
  {
    title: "Getting Started with React and TypeScript",
    description: "A comprehensive guide to setting up your first React project with TypeScript.",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=800&q=80",
    platform: "YouTube",
    duration: "14:35",
    likes: 1250,
    comments: 86,
    shares: 342,
    views: 15600,
    category: "Programming",
    isVideo: true,
    link: "https://youtube.com/watch?v=example1",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "Published",
    featured: true
  },
  {
    title: "Advanced CSS Animation Techniques",
    description: "Learn how to create stunning animations with pure CSS and optimize them for performance.",
    thumbnailUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=800&q=80",
    platform: "YouTube",
    duration: "18:22",
    likes: 983,
    comments: 62,
    shares: 215,
    views: 12400,
    category: "CSS",
    isVideo: true,
    link: "https://youtube.com/watch?v=example2",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    status: "Published",
    featured: true
  }
];

// Sample other works data
const sampleOtherWorks = [
  {
    title: "AI-Powered Voice Assistant",
    description: "A custom voice assistant built using TensorFlow and NLP models that can control smart home devices.",
    category: "AI Development",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    date: new Date().toISOString().split('T')[0],
    link: "https://example.com/voice-assistant",
    technologies: ["TensorFlow", "Python", "NLP", "IoT"],
    status: "Published",
    featured: true
  },
  {
    title: "Custom Design System",
    description: "A comprehensive design system built for a fintech startup with a focus on accessibility.",
    category: "UI/UX Design",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    date: new Date().toISOString().split('T')[0],
    link: "https://example.com/design-system",
    technologies: ["Figma", "Adobe XD", "WCAG", "Design Systems"],
    status: "Published",
    featured: true
  }
];

// Function to initialize database with sample data
export const initializeDatabaseWithSampleData = async () => {
  try {
    // First, clear any existing demo data
    await clearAllDemoData();
    toast({
      title: "Existing data cleared",
      description: "Successfully removed all existing demo data."
    });
    
    // Add sample projects
    for (const project of sampleProjects) {
      await addDoc(collection(db, "projects"), {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Add sample blog posts
    for (const blogPost of sampleBlogPosts) {
      await addDoc(collection(db, "blogPosts"), {
        ...blogPost,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Add sample videos
    for (const video of sampleVideos) {
      await addDoc(collection(db, "contents"), {
        ...video,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Add sample other works
    for (const work of sampleOtherWorks) {
      await addDoc(collection(db, "otherWorks"), {
        ...work,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    toast({
      title: "Database initialized",
      description: "Sample data has been added to your database."
    });
    
    return true;
  } catch (error) {
    console.error("Error initializing database with sample data:", error);
    toast({
      title: "Error",
      description: `Failed to initialize database: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    return false;
  }
};

// Function to check if collections are empty
export const checkIfCollectionsEmpty = async () => {
  try {
    let isEmpty = true;
    const collections = ["projects", "blogPosts", "contents", "otherWorks"];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      if (!snapshot.empty) {
        isEmpty = false;
        break;
      }
    }
    
    return isEmpty;
  } catch (error) {
    console.error("Error checking if collections are empty:", error);
    return null;
  }
};
