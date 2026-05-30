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

export interface ProjectPub {
  text: string;
  venue?: string;
  doi: string;
}

export interface ProjectGalleryItem {
  type: 'photo' | 'video';
  image?: string;
  video_url?: string;
  alt?: string;
  caption?: string;
}

export interface ProjectFrontmatter {
  title: string;
  status: 'active' | 'completed' | 'emerging';
  tags: string[];
  order: number;
  team?: string;
  partners?: string;
  funding?: string;
  pubs?: ProjectPub[];
  gallery_enabled?: boolean;
  gallery?: ProjectGalleryItem[];
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}
