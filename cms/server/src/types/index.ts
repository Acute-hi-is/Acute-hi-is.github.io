export interface GalleryItem {
  image: string;
  alt: string;
  caption: string;
}

export interface StatItem {
  number: string;
  label: string;
  link?: string;
}

export interface FeatureItem {
  label: string;
  title: string;
  image: string;
  image_alt: string;
  text: string;
  meta: string;
  doi: string;
  reverse: boolean;
}

export interface Partner {
  name: string;
  url: string;
  logo: string;
  alt: string;
}

export interface PartnersData {
  research: Partner[];
  industry: Partner[];
  funders: Partner[];
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi: string;
  topic: 'haptics' | 'acoustics' | 'perception';
  summary: string;
  image?: string;
  pdf?: string;
}

export interface ResearchPub {
  text: string;
  doi: string;
}

export interface ResearchArea {
  title: string;
  slug: string;
  image: string;
  image_alt: string;
  highlight_image: string;
  summary: string;
  description: string[];
  pubs: ResearchPub[];
}

export interface TeamMember {
  slug: string;
  title: string;
  role: string;
  photo: string;
  email?: string;
  profile?: string;
  status: 'current' | 'past';
  order: number;
  content: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  content: string;
}
