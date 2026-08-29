export type RequestStatus = "completed" | "in_progress" | "pending_review";

export interface CustomRequest {
  id: string;
  title: string;
  description: string;
  date: string;
  status: RequestStatus;
  statusText: string;
  imageUrl?: string;
  artisanName?: string;
  artisanInitials?: string;
  artisanAvatar?: string;
  detailsStatusText?: string;
}

export interface NewRequestFormData {
  title: string;
  description: string;
  woodType?: string;
  dimensions?: string;
  budget?: string;
}
export interface ShowcaseCardData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  status: string;
  accent: string;
  image: string;
  imageAlt: string;
}
