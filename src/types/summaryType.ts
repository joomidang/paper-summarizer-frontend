export interface Summary {
  commentCount: number;
  createdAt: string;
  likes: number;
  public: boolean;
  summaryId: number;
  title: string;
}

export interface SummaryData {
  title: string;
  brief: string;
  likeCount: number;
  publishedAt: string;
  tags: string[];
  viewCount: number;
  markdownUrl: string;
}

export interface PopularSummary {
  authorName: string;
  authorProfileImage?: string;
  brief: string;
  commentCount: number;
  createdAt?: string;
  likeCount: number;
  popularityScore?: number;
  publishedAt: string;
  summaryId: number;
  title: string;
  viewCount: number;
}
