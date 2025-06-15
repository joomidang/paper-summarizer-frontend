"use client";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { Summary } from "@/types/summaryType";
import { useRouter } from "next/navigation";
import React from "react";

const MyLikes = ({ summary }: { summary: Summary }) => {
  const router = useRouter();
  return (
    <div
      key={summary.summaryId}
      className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => {
        router.push(`/papers/published/${summary.summaryId}`);
      }}
    >
      <div className="font-semibold text-base">{summary.title}</div>
      <div className="text-gray-400 text-xs">
        {summary.createdAt ? formatDateTime(summary.createdAt) : "날짜 없음"}
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <div className="flex gap-4">
          <span>💬 {summary.commentCount || 0}</span>
          <span>♥️ {summary.likes || 0}</span>
        </div>
        <span>Posted by Me</span>
      </div>
    </div>
  );
};

export default MyLikes;
