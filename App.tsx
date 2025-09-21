import React, { useState, useEffect } from 'react';
import { produce } from 'immer';
import TemplateSelector from './components/TemplateSelector';
import ResumeEditor from './components/ResumeEditor';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { ResumeData, TemplateId } from './types';
import { NEW_RESUME_TEMPLATE } from './constants';

const App: React.FC = () => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [step, setStep] = useState<'dashboard' | 'template' | 'editor'>('dashboard');
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);

  // Check for a logged-in user on initial render
  useEffect(() => {
    try {
      const lastUserEmail = localStorage.getItem('ai-resume-last-user');
      if (lastUserEmail) {
        handleLogin(lastUserEmail);
      }
    } catch (error) {
      console.error("Failed to get last user from localStorage", error);
    }
  }, []);
  
  // Load resumes when the user changes
  useEffect(() => {
    if (currentUserEmail) {
      try {
        const savedResumes = localStorage.getItem(`ai-resumes-${currentUserEmail}`);
        if (savedResumes) {
          setResumes(JSON.parse(savedResumes));
        } else {
          setResumes([]);
        }
      } catch (error) {
        console.error("Failed to load resumes from localStorage", error);
        setResumes([]);
      }
    }
  }, [currentUserEmail]);

  // Save resumes to localStorage whenever they change for the current user
  useEffect(() => {
    if (currentUserEmail) {
      try {
        localStorage.setItem(`ai-resumes-${currentUserEmail}`, JSON.stringify(resumes));
      } catch (error) {
        console.error("Failed to save resumes to localStorage", error);
      }
    }
  }, [resumes, currentUserEmail]);
  
  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
    localStorage.setItem('ai-resume-last-user', email);
    setStep('dashboard'); // Go to dashboard after login
  };
  
  const handleLogout = () => {
    setCurrentUserEmail(null);
    localStorage.removeItem('ai-resume-last-user');
    setResumes([]);
    setActiveResumeId(null);
  };
  
  const handleCreateNew = () => {
    setStep('template');
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    const newResume: ResumeData = {
      ...NEW_RESUME_TEMPLATE,
      id: crypto.randomUUID(),
      lastModified: Date.now(),
      templateId: templateId,
      personalDetails: {
        ...NEW_RESUME_TEMPLATE.personalDetails,
        fullName: 'Your Name',
      }
    };
    
    setResumes(produce(draft => {
      draft.push(newResume);
    }));
    setActiveResumeId(newResume.id);
    setStep('editor');
  };

  const handleSelectResume = (id: string) => {
    setActiveResumeId(id);
    setStep('editor');
  };
  
  const handleDeleteResume = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };
  
  const handleBackToDashboard = () => {
    setActiveResumeId(null);
    setStep('dashboard');
  };

  const activeResume = resumes.find(r => r.id === activeResumeId);

  const setActiveResumeData = (updater: (draft: ResumeData) => void) => {
    setResumes(
      produce(draft => {
        const resume = draft.find(r => r.id === activeResumeId);
        if (resume) {
          updater(resume);
          resume.lastModified = Date.now();
        }
      })
    );
  };
  
  if (!currentUserEmail) {
    return <Login onLogin={handleLogin} />;
  }
  
  const renderStep = () => {
    switch (step) {
      case 'editor':
        if (activeResume) {
          return (
            <ResumeEditor
              resumeData={activeResume}
              setResumeData={setActiveResumeData}
              onBack={handleBackToDashboard}
            />
          );
        }
        // Fallback to dashboard if no active resume
        return <Dashboard userEmail={currentUserEmail} resumes={resumes} onCreateNew={handleCreateNew} onSelectResume={handleSelectResume} onDeleteResume={handleDeleteResume} onLogout={handleLogout} />;
      case 'template':
        return <TemplateSelector onSelectTemplate={handleTemplateSelect} />;
      case 'dashboard':
      default:
        return <Dashboard userEmail={currentUserEmail} resumes={resumes} onCreateNew={handleCreateNew} onSelectResume={handleSelectResume} onDeleteResume={handleDeleteResume} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {renderStep()}
    </div>
  );
};

export default App;