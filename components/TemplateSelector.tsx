
import React from 'react';
import { TemplateId } from '../types';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: TemplateId) => void;
}

const templates = [
  { id: 'modern', name: 'Modern', imageUrl: 'https://storage.googleapis.com/maker-suite-project-files-prod/ai-studio-template-images/modern.png' },
  { id: 'classic', name: 'Classic', imageUrl: 'https://storage.googleapis.com/maker-suite-project-files-prod/ai-studio-template-images/classic.png' },
];

const TemplateCard: React.FC<{
  id: TemplateId,
  name: string,
  imageUrl: string,
  onSelect: (id: TemplateId) => void
}> = ({ id, name, imageUrl, onSelect }) => (
  <div
    className="group cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
    onClick={() => onSelect(id)}
    role="button"
    aria-label={`Select ${name} template`}
  >
    <img src={imageUrl} alt={`${name} Template`} className="w-full h-auto object-cover border-b" />
    <div className="p-6">
      <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">{name}</h3>
      <p className="text-slate-500 mt-1">A clean and professional design.</p>
    </div>
  </div>
);

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-2">Create a New Resume</h1>
        <p className="text-lg text-slate-600">Select a professionally designed template to start.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center max-w-4xl mx-auto">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id as TemplateId}
            name={template.name}
            imageUrl={template.imageUrl}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
