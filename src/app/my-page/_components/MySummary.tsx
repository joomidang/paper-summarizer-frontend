"use client";
import { apiUrl } from "@/app/contexts/AuthContext";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { getCookie } from "@/app/utils/getCookie";
import { Summary } from "@/types/summaryType";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const MySummary = ({ summary }: { summary: Summary }) => {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/papers/upload/edit/${summary.summaryId}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await fetch(
      `${apiUrl}/api/summaries/${summary.summaryId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("accessToken")}`,
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      toast.success("요약본이 삭제되었습니다.", {
        onClose: () => {
          window.location.reload();
        },
      });
    }
  };

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
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="px-2 py-1 text-[#1A2747] hover:bg-gray-100 rounded"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-red-500 hover:bg-gray-100 rounded"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySummary;
