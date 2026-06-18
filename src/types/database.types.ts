export type Role = 'superadmin' | 'admin';
export type BatchStatus = 'upcoming' | 'ongoing' | 'completed' | 'full';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  created_at: string;
}

export interface CompanyProfile {
  id: number;
  name: string;
  description: string;
  about_us?: string | null;
  logo_id: string | null;
  logo?: MediaAsset;
  whatsapp_number: string;
  address: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Program {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  category?: Category;
  media_asset_id: string | null;
  media?: MediaAsset;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  program_id: string;
  program?: Program;
  name: string;
  start_date: string;
  end_date: string;
  status: BatchStatus;
  capacity: number;
  registered: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_id: string;
  author?: User;
  media_asset_id: string | null;
  media?: MediaAsset;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
