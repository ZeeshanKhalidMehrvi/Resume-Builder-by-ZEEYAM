
import React, { useCallback } from 'react';
import { ResumeData, WorkExperience, Education, ContactInfo } from '../types';
import ResumePreview from './ResumePreview';
import { refineTextWithGemini } from '../services/geminiService';
import MagicIcon from './icons/MagicIcon';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

interface ResumeEditorProps {
  resumeData: ResumeData;
  setResumeData: (updater: (draft: ResumeData) => void) => void;
  onBack: () => void;
}

const THEME_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f97316', '#334155'];

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData, setResumeData, onBack }) => {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(draft => {
      draft.personalDetails[name as 'fullName' | 'jobTitle'] = value;
    });
  };

  const handleContactInfoChange = (id: string, value: string) => {
    setResumeData(draft => {
      const contact = draft.personalDetails.contactInfo.find(c => c.id === id);
      if (contact) {
        contact.value = value;
      }
    });
  };

  const addContactInfo = () => {
    const newContact: ContactInfo = { id: crypto.randomUUID(), value: '' };
    setResumeData(draft => {
      draft.personalDetails.contactInfo.push(newContact);
    });
  };

  const removeContactInfo = (id: string) => {
    setResumeData(draft => {
      draft.personalDetails.contactInfo = draft.personalDetails.contactInfo.filter(c => c.id !== id);
    });
  };
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setResumeData(draft => {
      draft.summary = value;
    });
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setResumeData(draft => {
      draft.skills = skills;
    });
  };

  const handleWorkExperienceChange = (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(draft => {
      const exp = draft.workExperience.find(item => item.id === id);
      if (exp) {
        (exp as any)[name] = value;
      }
    });
  };

  const handleEducationChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData(draft => {
      const edu = draft.education.find(item => item.id === id);
      if (edu) {
        (edu as any)[name] = value;
      }
    });
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperience = { id: crypto.randomUUID(), company: '', jobTitle: '', location: '', startDate: '', endDate: '', description: '' };
    setResumeData(draft => {
      draft.workExperience.push(newExperience);
    });
  };
  
  const removeWorkExperience = (id: string) => {
    setResumeData(draft => {
      draft.workExperience = draft.workExperience.filter(item => item.id !== id);
    });
  };
  
  const addEducation = () => {
    const newEducation: Education = { id: crypto.randomUUID(), institution: '', degree: '', location: '', startDate: '', endDate: '' };
    setResumeData(draft => {
      draft.education.push(newEducation);
    });
  };
  
  const removeEducation = (id: string) => {
    setResumeData(draft => {
      draft.education = draft.education.filter(item => item.id !== id);
    });
  };

  const handleEnhanceText = useCallback(async (
    field: 'summary' | 'workDescription',
    text: string,
    updateFn: (newText: string) => void
  ) => {
    const loadingKey = `${field}-${(Math.random() + 1).toString(36).substring(7)}`;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    try {
      const refinedText = await refineTextWithGemini(field, text);
      updateFn(refinedText);
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
  }, []);
  
  const handleThemeColorChange = (color: string) => {
    setResumeData(draft => {
      draft.themeColor = color;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className="w-full lg:w-1/3 p-6 bg-white overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Resume Details</h2>
            <button onClick={onBack} className="text-sm text-blue-600 hover:underline">Back to Dashboard</button>
        </div>
        
        <div className="space-y-2 mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Color Theme</h3>
          <div className="flex gap-2 flex-wrap">
            {THEME_COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleThemeColorChange(color)}
                className={`w-8 h-8 rounded-full cursor-pointer transition transform hover:scale-110 ${resumeData.themeColor === color ? 'ring-2 ring-offset-2 ring-slate-800' : ''}`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-4 mb-6 p-4 border rounded-lg">
          <h3 className="font-semibold text-lg">Personal Details</h3>
          <input name="fullName" value={resumeData.personalDetails.fullName} onChange={handlePersonalDetailsChange} placeholder="Full Name" className="w-full p-2 border rounded"/>
          <input name="jobTitle" value={resumeData.personalDetails.jobTitle} onChange={handlePersonalDetailsChange} placeholder="Job Title" className="w-full p-2 border rounded"/>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Information</label>
            {resumeData.personalDetails.contactInfo.map((contact) => (
              <div key={contact.id} className="flex items-center gap-2">
                <input 
                  value={contact.value} 
                  onChange={(e) => handleContactInfoChange(contact.id, e.target.value)} 
                  placeholder="e.g., email, phone, website" 
                  className="w-full p-2 border rounded"
                />
                <button onClick={() => removeContactInfo(contact.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon /></button>
              </div>
            ))}
            <button onClick={addContactInfo} className="flex items-center gap-2 w-full text-sm justify-center py-1 border-2 border-dashed rounded-md hover:bg-slate-50 transition"><PlusIcon /> Add Contact</button>
          </div>
        </div>
        
        <div className="space-y-2 mb-6 p-4 border rounded-lg">
          <label className="font-semibold text-lg">Professional Summary</label>
          <textarea value={resumeData.summary} onChange={handleSummaryChange} placeholder="Write a brief summary..." className="w-full p-2 border rounded min-h-[120px]"/>
          <button 
            onClick={() => handleEnhanceText('summary', resumeData.summary, (newText) => setResumeData(d => {d.summary=newText}))} 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-slate-400"
            disabled={loadingStates['summary-summary']}
          >
            <MagicIcon /> {loadingStates['summary-summary'] ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>
        
        <div className="space-y-2 mb-6 p-4 border rounded-lg">
          <label className="font-semibold text-lg">Skills</label>
          <input value={resumeData.skills.join(', ')} onChange={handleSkillsChange} placeholder="e.g., React, TypeScript, Leadership" className="w-full p-2 border rounded"/>
          <p className="text-xs text-slate-500">Separate skills with a comma.</p>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-lg">Work Experience</h3>
          {resumeData.workExperience.map((exp, index) => (
            <div key={exp.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                 <h4 className="font-medium">Experience #{index + 1}</h4>
                 <button onClick={() => removeWorkExperience(exp.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
              </div>
              <input name="jobTitle" value={exp.jobTitle} onChange={e => handleWorkExperienceChange(exp.id, e)} placeholder="Job Title" className="w-full p-2 border rounded"/>
              <input name="company" value={exp.company} onChange={e => handleWorkExperienceChange(exp.id, e)} placeholder="Company" className="w-full p-2 border rounded"/>
              <input name="location" value={exp.location} onChange={e => handleWorkExperienceChange(exp.id, e)} placeholder="Location" className="w-full p-2 border rounded"/>
              <div className="flex gap-2">
                <input name="startDate" value={exp.startDate} onChange={e => handleWorkExperienceChange(exp.id, e)} placeholder="Start Date" className="w-1/2 p-2 border rounded"/>
                <input name="endDate" value={exp.endDate} onChange={e => handleWorkExperienceChange(exp.id, e)} placeholder="End Date" className="w-1/2 p-2 border rounded"/>
              </div>
              <textarea name="description" value={exp.description} onChange={e => handleWorkExperienceChange(exp.id, e)} placeholder="Describe your responsibilities and achievements..." className="w-full p-2 border rounded min-h-[120px]"/>
               <button 
                onClick={() => handleEnhanceText('workDescription', exp.description, (newText) => setResumeData(d => { const foundExp = d.workExperience.find(i => i.id === exp.id); if(foundExp) foundExp.description = newText; }))}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-slate-400"
                disabled={loadingStates[`workDescription-${exp.id}`]}
               >
                 <MagicIcon /> {loadingStates[`workDescription-${exp.id}`] ? 'Enhancing...' : 'Enhance Description'}
               </button>
            </div>
          ))}
          <button onClick={addWorkExperience} className="flex items-center gap-2 w-full justify-center py-2 border-2 border-dashed rounded-md hover:bg-slate-50 transition"><PlusIcon /> Add Experience</button>
        </div>
        
         <div className="space-y-4">
          <h3 className="font-semibold text-lg">Education</h3>
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                 <h4 className="font-medium">Education #{index + 1}</h4>
                 <button onClick={() => removeEducation(edu.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
              </div>
              <input name="institution" value={edu.institution} onChange={e => handleEducationChange(edu.id, e)} placeholder="Institution" className="w-full p-2 border rounded"/>
              <input name="degree" value={edu.degree} onChange={e => handleEducationChange(edu.id, e)} placeholder="Degree" className="w-full p-2 border rounded"/>
               <input name="location" value={edu.location} onChange={e => handleEducationChange(edu.id, e)} placeholder="Location" className="w-full p-2 border rounded"/>
              <div className="flex gap-2">
                <input name="startDate" value={edu.startDate} onChange={e => handleEducationChange(edu.id, e)} placeholder="Start Date" className="w-1/2 p-2 border rounded"/>
                <input name="endDate" value={edu.endDate} onChange={e => handleEducationChange(edu.id, e)} placeholder="End Date" className="w-1/2 p-2 border rounded"/>
              </div>
            </div>
          ))}
          <button onClick={addEducation} className="flex items-center gap-2 w-full justify-center py-2 border-2 border-dashed rounded-md hover:bg-slate-50 transition"><PlusIcon /> Add Education</button>
        </div>
      </div>
      <div className="w-full lg:w-2/3 bg-slate-200 p-6 lg:p-10 overflow-y-auto">
        <ResumePreview data={resumeData} setResumeData={setResumeData} />
      </div>
    </div>
  );
};

export default ResumeEditor;
