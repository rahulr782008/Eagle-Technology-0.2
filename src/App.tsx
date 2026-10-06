import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ThreeDShowcaseSection } from './components/ThreeDShowcaseSection';
import { Interactive3DTutorials } from './components/Interactive3DTutorials';
import { ChatbotSection } from './components/ChatbotSection';
import { PhotoEditorSection } from './components/PhotoEditorSection';
import { VideoEditorSection } from './components/VideoEditorSection';
import { MusicStudioSection } from './components/MusicStudioSection';
import { GoogleDocsSection } from './components/GoogleDocsSection';
import { CreativeToolsSection } from './components/CreativeToolsSection';
import { PublishedWorksSection } from './components/PublishedWorksSection';
import { AboutRahulSection } from './components/AboutRahulSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AnimatedSection } from './components/AnimatedSection';
import { PublishedWork } from './types';
import { auth, db, onAuthStateChanged, FirebaseUser } from './lib/firebase';
import { collection, doc, setDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';

const INITIAL_PUBLISHED_WORKS: PublishedWork[] = [
  {
    id: 'work-1',
    type: 'photo',
    title: 'Cybernetic Falcon Horizon',
    creator: 'Rahul R · Creator',
    description: 'Ultra-clarity neural grading with Eagle HDR Boost and cyan ambient rim illumination.',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    timestamp: '2 hours ago',
    likes: 48,
    tags: ['Eagle HDR', 'Cyberpunk', 'Rahul R'],
    filterDetails: 'Brightness: 110% | Contrast: 135% | Saturation: 130%',
  },
  {
    id: 'work-2',
    type: 'video',
    title: 'Quantum Metropolis HUD Reel',
    creator: 'Rahul R · Video Studio',
    description: 'Real-time sci-fi targeting reticle overlay with timed neural subtitles.',
    mediaUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    timestamp: '5 hours ago',
    likes: 64,
    tags: ['AI Video', 'HUD Reticle', 'Arunai Engg'],
    filterDetails: 'Aspect: 16:9 | Scanlines: ON | Subtitles: Synced',
  },
  {
    id: 'work-3',
    type: 'design',
    title: 'Procedural Eagle Cyber Emblem',
    creator: 'Rahul R · Creative Suite',
    description: 'Mathematical SVG vector insignia generated via the Eagle procedural geometry matrix.',
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    timestamp: '1 day ago',
    likes: 37,
    tags: ['Vector SVG', 'Procedural 3D', 'Eagle Tech'],
    filterDetails: 'Wingspan: 48px | Bevel: 3px | Cyan 06b6d4',
  },
  {
    id: 'work-4',
    type: 'photo',
    title: 'Neural AI Subject Horizon',
    creator: 'Rahul R · Creator',
    description: 'Deep obsidian contrast curve tuned for high-resolution futuristic portraits.',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    timestamp: '2 days ago',
    likes: 52,
    tags: ['Studio Clarity', 'AI Photo', 'Rahul R'],
    filterDetails: 'Brightness: 95% | Contrast: 145% | Vignette: 35%',
  },
];

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [publishedWorks, setPublishedWorks] = useState<PublishedWork[]>(INITIAL_PUBLISHED_WORKS);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Monitor Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              uid: user.uid,
              displayName: user.displayName || 'Eagle Creator',
              email: user.email || '',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Could not save user profile:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for real-time Firestore updates in published_works
  useEffect(() => {
    try {
      const worksCol = collection(db, 'published_works');
      const unsubscribeWorks = onSnapshot(
        worksCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const firestoreWorks: PublishedWork[] = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<PublishedWork, 'id'>),
            }));

            setPublishedWorks((prev) => {
              const map = new Map<string, PublishedWork>();
              firestoreWorks.forEach((w) => map.set(w.id, w));
              prev.forEach((w) => {
                if (!map.has(w.id)) map.set(w.id, w);
              });
              return Array.from(map.values());
            });
          }
        },
        (error) => {
          console.warn('Firestore snapshot notice:', error);
        }
      );

      return () => unsubscribeWorks();
    } catch (e) {
      console.warn('Firestore setup listener notice:', e);
    }
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePublishWork = async (newWork: PublishedWork) => {
    const workToSave: PublishedWork = {
      ...newWork,
      creator: currentUser?.displayName ? `${currentUser.displayName} · Creator` : newWork.creator,
    };

    setPublishedWorks((prev) => [workToSave, ...prev]);

    try {
      await setDoc(doc(db, 'published_works', workToSave.id), workToSave);
    } catch (err) {
      console.warn('Could not persist to Firestore:', err);
    }

    setTimeout(() => {
      handleNavigate('published-works');
    }, 500);
  };

  const handleLikeWork = async (workId: string) => {
    setPublishedWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, likes: w.likes + 1 } : w))
    );

    try {
      const workRef = doc(db, 'published_works', workId);
      await updateDoc(workRef, {
        likes: increment(1),
      });
    } catch (e) {
      // Doc might be local initial work
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fixed Sticky Header Navigation with Framer Motion Sliding Indicators */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
      />

      {/* Main Content Sections with Framer-Motion Transitions */}
      <main className="flex-1">
        {/* 1. 3D Hero Section */}
        <AnimatedSection id="hero" delay={0.1}>
          <HeroSection onNavigate={handleNavigate} />
        </AnimatedSection>

        {/* 2. Interactive 3D Models & Assets Explorer */}
        <AnimatedSection id="3d-models" delay={0.12}>
          <ThreeDShowcaseSection />
        </AnimatedSection>

        {/* 3. Interactive 3D Tutorials Hub */}
        <AnimatedSection id="tutorials" delay={0.15}>
          <Interactive3DTutorials onNavigateToTool={handleNavigate} />
        </AnimatedSection>

        {/* 3. AI Chatbot Section */}
        <AnimatedSection id="chatbot" delay={0.15}>
          <ChatbotSection />
        </AnimatedSection>

        {/* 4. AI Photo Editor Section */}
        <AnimatedSection id="photo-editor" delay={0.15}>
          <PhotoEditorSection onPublish={handlePublishWork} />
        </AnimatedSection>

        {/* 5. AI Video Editor Section */}
        <AnimatedSection id="video-editor" delay={0.15}>
          <VideoEditorSection onPublish={handlePublishWork} />
        </AnimatedSection>

        {/* 6. AI Music Studio Section (Lyria 3) */}
        <AnimatedSection id="music-studio" delay={0.15}>
          <MusicStudioSection onPublish={handlePublishWork} />
        </AnimatedSection>

        {/* 7. Google Docs Studio Section (Google Workspace) */}
        <AnimatedSection id="google-docs" delay={0.15}>
          <GoogleDocsSection currentUser={currentUser} />
        </AnimatedSection>

        {/* 8. Creative Tools Section */}
        <AnimatedSection id="creative-tools" delay={0.15}>
          <CreativeToolsSection />
        </AnimatedSection>

        {/* 9. Projects / Published Works Section */}
        <AnimatedSection id="published-works" delay={0.15}>
          <PublishedWorksSection works={publishedWorks} onLike={handleLikeWork} />
        </AnimatedSection>

        {/* 10. About Rahul R Section */}
        <AnimatedSection id="about" delay={0.15}>
          <AboutRahulSection onNavigateContact={() => handleNavigate('contact')} />
        </AnimatedSection>

        {/* 11. Education Section */}
        <AnimatedSection id="education" delay={0.15}>
          <EducationSection />
        </AnimatedSection>

        {/* 12. Contact Section */}
        <AnimatedSection id="contact" delay={0.15}>
          <ContactSection />
        </AnimatedSection>
      </main>

      {/* Footer with "Created by Rahul R" */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
