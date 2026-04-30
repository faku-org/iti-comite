export interface DocumentMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  lang: string;
  pinned: boolean;
  excerpt: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}
