
export type TemplateId = 'modern' | 'classic';

export interface ContactInfo {
  id: string;
  value: string;
}

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  contactInfo: ContactInfo[];
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  id: string;
  lastModified: number;
  templateId: TemplateId;
  themeColor: string; // e.g., hex code like '#3b82f6'
  personalDetails: PersonalDetails;
  summary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
}
