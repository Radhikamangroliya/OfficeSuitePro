export interface TimelineEntry {
  id: number;
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  eventDate?: string;
  createdAt?: string;
  entryType?: string;
  sourceApi?: string;
}