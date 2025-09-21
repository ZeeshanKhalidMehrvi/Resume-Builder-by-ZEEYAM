
import React from 'react';
import { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalDetails, summary, skills, workExperience, education, themeColor } = data;

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h2 className="text-xl font-semibold border-b-2 pb-1 mb-3" style={{ borderColor: themeColor, color: themeColor }}>
      {title}
    </h2>
  );
  
  return (
    <div className="w-full h-full p-10 font-serif bg-white text-gray-900">
      <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
        <h1 className="text-4xl font-bold tracking-wider" style={{ color: themeColor }}>{personalDetails.fullName}</h1>
        <p className="text-lg font-light mt-1">{personalDetails.jobTitle}</p>
        <div className="text-xs flex justify-center gap-x-3 gap-y-1 mt-2 flex-wrap text-slate-600">
          {personalDetails.contactInfo.map(info => info.value).join('  •  ')}
        </div>
      </header>

      <main>
        <section className="mb-6">
          <SectionHeader title="Summary" />
          <p className="text-sm leading-relaxed">{summary}</p>
        </section>

        <section className="mb-6">
          <SectionHeader title="Skills" />
          <p className="text-sm">{skills.join(' • ')}</p>
        </section>

        <section className="mb-6">
          <SectionHeader title="Experience" />
          {workExperience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{exp.jobTitle}</h3>
                <p className="text-xs font-normal">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-sm italic">{exp.company}, {exp.location}</p>
              <ul className="mt-1 list-disc list-inside text-sm space-y-1 text-gray-700">
                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^-/, '').trim()}</li>)}
              </ul>
            </div>
          ))}
        </section>
        
        <section>
          <SectionHeader title="Education" />
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold">{edu.institution}</h3>
                <p className="text-xs font-normal">{edu.startDate} - {edu.endDate}</p>
              </div>
              <p className="text-sm italic">{edu.degree}, {edu.location}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default ClassicTemplate;
