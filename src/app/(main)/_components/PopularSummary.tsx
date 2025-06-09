"use client";
import { formatDateTime } from "@/app/utils/formatDateTime";
import type { PopularSummary } from "@/types/summaryType";
import { useRouter } from "next/navigation";
import React from "react";

const PopularSummary = ({ summary }: { summary: PopularSummary }) => {
  const router = useRouter();
  return (
    <div
      key={summary.summaryId}
      className="bg-white rounded-xl shadow p-6 flex flex-col justify-between gap-2 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        router.push(`/papers/published/${summary.summaryId}`);
      }}
    >
      <div className="font-semibold text-base">
        <h1>{summary.title}</h1>
        <p className="text-gray-500 text-sm truncate">{summary.brief}</p>
      </div>
      <div>
        <div className="text-gray-400 text-xs">
          {summary.publishedAt
            ? formatDateTime(summary.publishedAt)
            : "날짜 없음"}
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex gap-4">
            <span>💬 {summary.commentCount || 0}</span>
            <span>♥️ {summary.likeCount || 0}</span>
          </div>
          <span>posted by {summary.authorName}</span>
        </div>
      </div>
    </div>
  );
};

export default PopularSummary;
