
import React from 'react';
import { ResumeData } from '../types';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';
import LogoutIcon from './icons/LogoutIcon';

interface DashboardProps {
  userEmail: string;
  resumes: ResumeData[];
  onCreateNew: () => void;
  onSelectResume: (id: string) => void;
  onDeleteResume: (id: string) => void;
  onLogout: () => void;
}

const ResumeCard: React.FC<{ resume: ResumeData, onSelect: () => void, onDelete: () => void }> = ({ resume, onSelect, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when deleting
    if(window.confirm(`Are you sure you want to delete the resume for ${resume.personalDetails.fullName}?`)) {
      onDelete();
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
      onClick={onSelect}
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800 truncate">{resume.personalDetails.fullName || 'Untitled Resume'}</h3>
        <p className="text-sm text-slate-600">{resume.personalDetails.jobTitle || 'No title'}</p>
        <p className="text-xs text-slate-400 mt-2">
          Last updated: {new Date(resume.lastModified).toLocaleDateString()}
        </p>
      </div>
       <div className="flex justify-between items-center mt-4">
        <span className="text-xs font-semibold uppercase px-2 py-1 rounded" style={{backgroundColor: resume.themeColor, color: 'white'}}>{resume.templateId}</span>
        <button
          onClick={handleDelete}
          className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700 transition"
          aria-label="Delete resume"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ userEmail, resumes, onCreateNew, onSelectResume, onDeleteResume, onLogout }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Your Resumes</h1>
          <p className="text-sm text-slate-500">Signed in as: <span className="font-medium">{userEmail}</span></p>
        </div>
        <div className="flex items-center gap-4">
            <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
            <PlusIcon /> Create New
            </button>
            <button 
                onClick={onLogout}
                className="p-3 bg-slate-200 text-slate-600 rounded-lg shadow-sm hover:bg-slate-300 transition"
                aria-label="Sign Out"
            >
                <LogoutIcon />
            </button>
        </div>
      </header>

      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {resumes.sort((a,b) => b.lastModified - a.lastModified).map(resume => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onSelect={() => onSelectResume(resume.id)}
              onDelete={() => onDeleteResume(resume.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-slate-700">No Resumes Yet</h2>
            <p className="text-slate-500 mt-2 mb-6">Click "Create New" to start building your professional resume.</p>
            <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition mx-auto"
            >
                <PlusIcon /> Create Your First Resume
            </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
