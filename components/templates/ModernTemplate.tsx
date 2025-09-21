
import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, summary, skills, workExperience, education, themeColor } = data;

  return (
    <div className="w-full h-full p-8 font-sans text-sm text-gray-800 flex bg-white">
      {/* Left Column */}
      <div className="w-1/3 bg-slate-800 text-white p-6 flex flex-col">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-1">{personalDetails.fullName}</h1>
            <h2 className="text-lg font-light text-slate-300">{personalDetails.jobTitle}</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: themeColor }}>Contact</h3>
          <ul className="space-y-1 text-xs text-slate-300">
            {personalDetails.contactInfo.map(contact => (
              <li key={contact.id}>{contact.value}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: themeColor }}>Skills</h3>
          <ul className="flex flex-wrap gap-1.5 text-xs">
            {skills.map((skill, index) => (
              <li key={index} className="text-white px-2 py-1 rounded-sm" style={{ backgroundColor: themeColor }}>{skill}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: themeColor }}>Education</h3>
          {education.map(edu => (
            <div key={edu.id} className="mb-3">
              <h4 className="font-bold text-xs text-white">{edu.degree}</h4>
              <p className="text-xs text-slate-300">{edu.institution}</p>
              <p className="text-xs text-slate-400">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </div>

      </div>
      
      {/* Right Column */}
      <div className="w-2/3 p-6 pl-8">
        <section className="mb-6">
          <h3 className="text-lg font-bold text-slate-800 border-b-2 pb-1 mb-3" style={{borderColor: themeColor}}>Profile Summary</h3>
          <p className="text-xs leading-relaxed">{summary}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-slate-800 border-b-2 pb-1 mb-3" style={{borderColor: themeColor}}>Work Experience</h3>
          {workExperience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-base">{exp.jobTitle}</h4>
                <p className="text-xs font-medium text-slate-600">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-sm font-semibold" style={{color: themeColor}}>{exp.company} | {exp.location}</p>
              <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ModernTemplate;
