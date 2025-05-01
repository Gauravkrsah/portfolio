import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  DocumentData,
  Timestamp,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { BlogPost, Content, OtherWork, Project, Video } from "../models";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQNSx97VV8Dcln1w8AjDobyXyyG00FvBU",
  authDomain: "portfolio-2be29.firebaseapp.com",
  projectId: "portfolio-2be29",
  storageBucket: "portfolio-2be29.firebasestorage.app",
  messagingSenderId: "859700584283",
  appId: "1:859700584283:web:4a9445abfcdb9c450a447e",
  measurementId: "G-NEYXC93WCC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

// Helper to convert Firebase timestamp to ISO string for consistent interface
const convertTimestamps = (doc: DocumentData) => {
  const data = { ...doc };
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate().toISOString();
    }
  });
  return data;
};

// Clear demo data for fresh start
export const clearAllDemoData = async () => {
  try {
    await clearCollection("projects");
    await clearCollection("blogPosts");
    await clearCollection("otherWorks");
    await clearCollection("contents");
    return true;
  } catch (error) {
    console.error("Error clearing demo data:", error);
    throw error;
  }
};

// Helper to clear a collection
const clearCollection = async (collectionName: string) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Collection ${collectionName} cleared successfully`);
    return true;
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error);
    throw error;
  }
};

// Projects collection
export const getProjects = async () => {
  try {
    const projectsQuery = query(
      collection(db, "projects"), 
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(projectsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as Project[];
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
};

export const getFeaturedProjects = async () => {
  try {
    const projectsQuery = query(
      collection(db, "projects"),
      where("featured", "==", true),
      where("status", "==", "Published"),
      limit(6)
    );
    const snapshot = await getDocs(projectsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as Project[];
  } catch (error) {
    console.error("Error getting featured projects:", error);
    return [];
  }
};

export const getProjectById = async (id: string) => {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as unknown as Project;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting project:", error);
    return null;
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const projectData = {
      ...project,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      featured: project.featured || false,
      status: project.status || 'Draft'
    };
    
    const docRef = await addDoc(collection(db, "projects"), projectData);
    
    const newProject = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newProject.data() || {})
    } as unknown as Project;
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, {
      ...project,
      updatedAt: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(docRef);
    return {
      id,
      ...convertTimestamps(updatedDoc.data() || {})
    } as unknown as Project;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (id: string) => {
  try {
    await deleteDoc(doc(db, "projects", id));
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Blog Posts collection
export const getBlogPosts = async () => {
  try {
    const blogPostsQuery = query(
      collection(db, "blogPosts"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(blogPostsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as BlogPost[];
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return [];
  }
};

export const getFeaturedBlogPosts = async () => {
  try {
    const blogPostsQuery = query(
      collection(db, "blogPosts"),
      where("featured", "==", true),
      where("status", "==", "Published"),
      limit(3)
    );
    const snapshot = await getDocs(blogPostsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as BlogPost[];
  } catch (error) {
    console.error("Error getting featured blog posts:", error);
    return [];
  }
};

export const getBlogPostById = async (id: string) => {
  try {
    const docRef = doc(db, "blogPosts", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as unknown as BlogPost;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting blog post:", error);
    return null;
  }
};

export const createBlogPost = async (blogPost: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const blogPostData = {
      ...blogPost,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      featured: blogPost.featured || false,
      status: blogPost.status || 'Draft'
    };
    
    const docRef = await addDoc(collection(db, "blogPosts"), blogPostData);
    
    const newBlogPost = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newBlogPost.data() || {})
    } as unknown as BlogPost;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw new Error(`Failed to create blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateBlogPost = async (id: string, blogPost: Partial<BlogPost>) => {
  try {
    const docRef = doc(db, "blogPosts", id);
    await updateDoc(docRef, {
      ...blogPost,
      updatedAt: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(docRef);
    return {
      id,
      ...convertTimestamps(updatedDoc.data() || {})
    } as unknown as BlogPost;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    await deleteDoc(doc(db, "blogPosts", id));
    return true;
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};

// Other Works collection
export const getOtherWorks = async () => {
  try {
    const worksQuery = query(
      collection(db, "otherWorks"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(worksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as OtherWork[];
  } catch (error) {
    console.error("Error getting other works:", error);
    return [];
  }
};

export const getFeaturedOtherWorks = async () => {
  try {
    const worksQuery = query(
      collection(db, "otherWorks"),
      where("featured", "==", true),
      where("status", "==", "Published"),
      limit(3)
    );
    const snapshot = await getDocs(worksQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as OtherWork[];
  } catch (error) {
    console.error("Error getting featured other works:", error);
    return [];
  }
};

export const getOtherWorkById = async (id: string) => {
  try {
    const docRef = doc(db, "otherWorks", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as unknown as OtherWork;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting other work:", error);
    return null;
  }
};

export const createOtherWork = async (work: Omit<OtherWork, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const workData = {
      ...work,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      featured: work.featured || false,
      status: work.status || 'Draft'
    };
    
    const docRef = await addDoc(collection(db, "otherWorks"), workData);
    
    const newWork = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newWork.data() || {})
    } as unknown as OtherWork;
  } catch (error) {
    console.error("Error creating other work:", error);
    throw new Error(`Failed to create other work: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateOtherWork = async (id: string, work: Partial<OtherWork>) => {
  try {
    const docRef = doc(db, "otherWorks", id);
    await updateDoc(docRef, {
      ...work,
      updatedAt: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(docRef);
    return {
      id,
      ...convertTimestamps(updatedDoc.data() || {})
    } as unknown as OtherWork;
  } catch (error) {
    console.error("Error updating other work:", error);
    throw error;
  }
};

export const deleteOtherWork = async (id: string) => {
  try {
    await deleteDoc(doc(db, "otherWorks", id));
    return true;
  } catch (error) {
    console.error("Error deleting other work:", error);
    throw error;
  }
};

// Content/Videos collection
export const getContents = async () => {
  try {
    const contentsQuery = query(
      collection(db, "contents"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(contentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as Content[];
  } catch (error) {
    console.error("Error getting contents:", error);
    return [];
  }
};

export const getVideos = async () => {
  try {
    const videosQuery = query(
      collection(db, "contents"),
      where("isVideo", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(videosQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as Video[];
  } catch (error) {
    console.error("Error getting videos:", error);
    return [];
  }
};

export const getFeaturedVideos = async () => {
  try {
    const videosQuery = query(
      collection(db, "contents"),
      where("isVideo", "==", true),
      where("featured", "==", true),
      where("status", "==", "Published"),
      limit(2)
    );
    const snapshot = await getDocs(videosQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as unknown as Video[];
  } catch (error) {
    console.error("Error getting featured videos:", error);
    return [];
  }
};

export const getContentById = async (id: string) => {
  try {
    const docRef = doc(db, "contents", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...convertTimestamps(docSnap.data())
      } as unknown as Content;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting content:", error);
    return null;
  }
};

export const createContent = async (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const contentData = {
      ...content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      featured: content.featured || false,
      status: content.status || 'Draft',
      isVideo: content.isVideo || false,
      likes: content.likes || 0,
      comments: content.comments || 0,
      shares: content.shares || 0,
      views: content.views || 0
    };
    
    const docRef = await addDoc(collection(db, "contents"), contentData);
    
    const newContent = await getDoc(docRef);
    return {
      id: docRef.id,
      ...convertTimestamps(newContent.data() || {})
    } as unknown as Content;
  } catch (error) {
    console.error("Error creating content:", error);
    throw new Error(`Failed to create content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const updateContent = async (id: string, content: Partial<Content>) => {
  try {
    const docRef = doc(db, "contents", id);
    await updateDoc(docRef, {
      ...content,
      updatedAt: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(docRef);
    return {
      id,
      ...convertTimestamps(updatedDoc.data() || {})
    } as unknown as Content;
  } catch (error) {
    console.error("Error updating content:", error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    await deleteDoc(doc(db, "contents", id));
    return true;
  } catch (error) {
    console.error("Error deleting content:", error);
    throw error;
  }
};

// Initialize database with some basic collections if they don't exist
export const initializeDatabase = async () => {
  try {
    // Check if collections exist, if not, create them
    const collections = ["projects", "blogPosts", "otherWorks", "contents"];
    
    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      // If collection is empty, we could add some sample data here
      if (snapshot.empty) {
        console.log(`Collection ${collectionName} is empty. You may want to add some initial data.`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

// Export Firebase instances in case they're needed elsewhere
export { app, db };
