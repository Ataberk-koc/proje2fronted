export interface Category {
  id: number;
  title: string;
  slug: string;
  description?: string;
  banner?: string;
  status?: boolean;
  parent?: { title: string } | null;
}
