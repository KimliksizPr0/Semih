export interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  link: string;
  offline: boolean;
  patchLink?: string;
  createdAt?: Date;
}

export interface InsertProject {
  name: string;
  description: string;
  category: string;
  icon: string;
  link: string;
  offline: boolean;
  patchLink?: string;
}

export type Category = 'productivity' | 'design' | 'development' | 'tools';

export interface Filters {
  search: string;
  category: string;
  status: string;
}
