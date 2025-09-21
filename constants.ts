
import { ResumeData } from './types';

// This is a template for creating NEW resumes.
// It doesn't have an id or lastModified, which will be added on creation.
export const NEW_RESUME_TEMPLATE: Omit<ResumeData, 'id' | 'lastModified'> = {
  templateId: 'modern',
  themeColor: '#3b82f6', // Default blue color
  personalDetails: {
    fullName: 'Alex Doe',
    jobTitle: 'Senior Software Engineer',
    contactInfo: [
      { id: crypto.randomUUID(), value: 'alex.doe@email.com' },
      { id: crypto.randomUUID(), value: '123-456-7890' },
      { id: crypto.randomUUID(), value: 'San Francisco, CA' },
      { id: crypto.randomUUID(), value: 'linkedin.com/in/alexdoe' },
      { id: crypto.randomUUID(), value: 'alexdoe.dev' },
    ],
  },
  summary:
    'Innovative Senior Software Engineer with over 8 years of experience in developing scalable web applications and leading cross-functional teams. Proficient in React, Node.js, and cloud technologies. Passionate about creating intuitive user experiences and driving technical excellence.',
  skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Docker', 'CI/CD', 'Agile Methodologies'],
  workExperience: [
    {
      id: crypto.randomUUID(),
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description:
        '- Led the development of a new client-facing dashboard using React and TypeScript, improving user engagement by 25%.\n- Mentored a team of 4 junior engineers, fostering a culture of collaboration and continuous improvement.\n- Architected and implemented a microservices-based backend with Node.js, resulting in a 40% reduction in API response times.',
    },
    {
      id: crypto.randomUUID(),
      jobTitle: 'Software Engineer',
      company: 'Web Innovations',
      location: 'Boston, MA',
      startDate: 'Jun 2016',
      endDate: 'Dec 2019',
      description:
        '- Developed and maintained features for a high-traffic e-commerce platform using React and Redux.\n- Collaborated with product managers and designers to translate business requirements into technical solutions.\n- Optimized application performance, leading to a 15% increase in page load speed.',
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'State University',
      degree: 'M.S. in Computer Science',
      location: 'New York, NY',
      startDate: '2014',
      endDate: '2016',
    },
     {
      id: crypto.randomUUID(),
      institution: 'College of Technology',
      degree: 'B.S. in Software Engineering',
      location: 'Boston, MA',
      startDate: '2010',
      endDate: '2014',
    },
  ],
};
