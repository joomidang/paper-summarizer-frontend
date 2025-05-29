import React from "react";
interface SummaryBoxProps {
  summary: {
    id: number;
    summaryId: number;
    title: string;
    brief: string;
    authorName: string;
    authorProfileImage: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    popularityScore: number;
  };
}

const SummaryBox = ({ summary }: SummaryBoxProps) => {
  return (
    <div
      key={summary.summaryId}
      className="bg-white rounded-xl shadow p-6 flex flex-col gap-2"
    >
      <div className="flex gap-2 mb-2">
        <span className="bg-[#E6EFFF] text-[#1A2747] text-xs px-2 py-1 rounded">
          AI
        </span>
        <span className="bg-[#E6EFFF] text-[#1A2747] text-xs px-2 py-1 rounded">
          GPT
        </span>
      </div>
      <div className="font-semibold text-base">{summary?.title}</div>
      <div className="text-gray-400 text-xs">{summary?.brief}</div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex gap-4">
          <span>{summary?.viewCount}</span>
          <span>{summary?.commentCount}</span>
          <span>{summary?.likeCount}</span>
        </div>
        <span>Posted by {summary?.authorName}</span>
      </div>
    </div>
  );
};

export default SummaryBox;
