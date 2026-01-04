
export interface Education {
  period: string;
  degree: string;
  institution: string;
  location: string;
  details: string;
}

export interface ResearchProject {
  title: string;
  role: string;
  description: string;
  link?: string;
  linkText?: string;
  tags: string[];
  type?: 'Web App' | 'Project' | 'Live' | 'Report' | 'Abstract';
}

export interface Repository {
  name: string;
  description: string;
  stars: number;
  link: string;
}

export interface Experience {
  period: string;
  role: string;
  organization: string;
  location: string;
  points: string[];
}

export interface Publication {
  year: string;
  title: string;
  authors: string;
  venue: string;
  link?: string;
  type: 'Journal' | 'Conference' | 'Patent';
  status?: 'Pipeline' | 'Published' | 'Accepted' | 'In Review' | 'Submitted' | 'In Process';
}

export interface SkillCategory {
  category: string;
  skills: string;
  icon?: any;
}

export interface Award {
  title: string;
}

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  base: boolean;
  type: 'intl' | 'domestic';
  event?: string;
}

export interface Lecture {
  title: string;
  event: string;
  year: string;
  image?: string;
}
