
import React, { useRef, useState } from 'react';
import { ResumeData, TemplateId } from '../types';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import DownloadIcon from './icons/DownloadIcon';

// Forward declaration for jsPDF and html2canvas from CDN
declare const jspdf: any;
declare const html2canvas: any;


interface ResumePreviewProps {
  data: ResumeData;
  setResumeData: (updater: (draft: ResumeData) => void) => void;
}

const availableTemplates = [
  { id: 'modern', name: 'Modern', imageUrl: 'https://storage.googleapis.com/maker-suite-project-files-prod/ai-studio-template-images/modern.png' },
  { id: 'classic', name: 'Classic', imageUrl: 'https://storage.googleapis.com/maker-suite-project-files-prod/ai-studio-template-images/classic.png' },
];

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, setResumeData }) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleTemplateChange = (templateId: TemplateId) => {
    setResumeData(draft => {
      draft.templateId = templateId;
    });
  };

  const handleDownload = async (format: 'pdf' | 'png') => {
    if (!resumeRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${data.personalDetails.fullName.replace(' ', '_')}_Resume.png`;
        link.href = imgData;
        link.click();
      } else {
        const { jsPDF } = jspdf;
        // A4 dimensions in inches: 8.5 x 11. We set the canvas to this size.
        // PDF units are in points (72 points per inch).
        const pdfWidth = 8.5 * 72;
        const pdfHeight = 11 * 72;
        const canvasAspectRatio = canvas.width / canvas.height;
        const pdfAspectRatio = pdfWidth / pdfHeight;

        let finalWidth, finalHeight;
        if (canvasAspectRatio > pdfAspectRatio) {
            finalWidth = pdfWidth;
            finalHeight = pdfWidth / canvasAspectRatio;
        } else {
            finalHeight = pdfHeight;
            finalWidth = pdfHeight * canvasAspectRatio;
        }

        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
        pdf.save(`${data.personalDetails.fullName.replace(' ', '_')}_Resume.pdf`);
      }
    } catch (error) {
      console.error("Error during download:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const templates: Record<TemplateId, React.ElementType> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
  };

  const SelectedTemplate = templates[data.templateId];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-4xl flex justify-end gap-3">
        <button 
          onClick={() => handleDownload('pdf')}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-slate-400"
        >
          <DownloadIcon /> {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
        <button
          onClick={() => handleDownload('png')}
          disabled={isDownloading}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition disabled:bg-slate-400"
        >
          <DownloadIcon /> {isDownloading ? 'Downloading...' : 'Download PNG'}
        </button>
      </div>

      <div ref={resumeRef} className="w-[8.5in] h-[11in] bg-white shadow-2xl overflow-hidden">
          <SelectedTemplate data={data} />
      </div>

      <div className="w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
        <h4 className="text-center font-semibold mb-3 text-slate-700">Change Template</h4>
        <div className="flex justify-center gap-4">
          {availableTemplates.map((t) => (
            <div
              key={t.id}
              onClick={() => handleTemplateChange(t.id as TemplateId)}
              className={`cursor-pointer rounded-md overflow-hidden border-2 transition hover:opacity-100 hover:border-blue-500 ${data.templateId === t.id ? 'border-blue-500 opacity-100' : 'border-transparent opacity-70'}`}
              role="button"
              aria-label={`Switch to ${t.name} template`}
            >
              <img src={t.imageUrl} alt={`${t.name} template thumbnail`} className="w-24 h-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
