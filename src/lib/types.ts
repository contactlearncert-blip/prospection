export type ProspectStatus = 'new' | 'contacted' | 'replied' | 'interested' | 'not_interested';

export const industries = [
  'Tech',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Marketing',
  'Real Estate',
] as const;

export type Industry = (typeof industries)[number];

export type Prospect = {
  id: string;
  name: string;
  company: string;
  industry: Industry;
  location: string;
  contact: {
    email: string;
    phone?: string;
    website: string;
  };
  status: ProspectStatus;
  lastContacted: string | null;
  onlinePresence: string;
  avatar: string;
  userId: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
};
