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
