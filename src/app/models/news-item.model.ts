export interface NewsItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt: Date;
  imageUrl?: string;
  additionalImages?: string[];
  categories?: string[];
}
