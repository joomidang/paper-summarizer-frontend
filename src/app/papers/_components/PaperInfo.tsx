"use client";

import { SummaryData } from "@/types/summaryType";
import React, { useState } from "react";
import { IoEyeOutline, IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { useSummaryLike } from "@/hooks/useUserData";
import { useParams } from "next/navigation";

const PaperInfo = ({ summaryData }: { summaryData: SummaryData }) => {
  const params = useParams();
  const summaryId = params.summaryId as string;
  const [currentLikeCount, setCurrentLikeCount] = useState(
    summaryData.likeCount
  );
  const [isHeartClicked, setIsHeartClicked] = useState<boolean>(
    summaryData.likeCount > 0 ? true : false
  );

  const { toggleLike, isLoading } = useSummaryLike(summaryId, {
    onSuccess: (data) => {
      setCurrentLikeCount(data.likeCount);
      setIsHeartClicked(data.liked);
    },
    onError: (error) => {
      setCurrentLikeCount(summaryData.likeCount);
      setIsHeartClicked(summaryData.likeCount > 0);
      console.error("좋아요 처리 실패:", error);
    },
  });

  const onHeartClick = () => {
    if (isLoading) return;
    const previousCount = currentLikeCount;
    const newCount =
      currentLikeCount > 0 ? currentLikeCount - 1 : currentLikeCount + 1;
    setIsHeartClicked(!isHeartClicked);
    setCurrentLikeCount(newCount);
    toggleLike(previousCount);
  };

  return (
    <div className="w-[35.625rem] bg-white rounded-lg border border-gray-300 p-4 mb-3 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1 text-gray-600 cursor-pointer"
            onClick={onHeartClick}
          >
            {currentLikeCount > 0 || isHeartClicked ? (
              <IoHeartSharp className="text-red-600 text-2xl" />
            ) : (
              <IoHeartOutline className="text-2xl text-gray-500" />
            )}
            <span>{currentLikeCount}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <IoEyeOutline className="text-2xl" />
            <span>{summaryData.viewCount}</span>
          </div>
        </div>
        <div className="text-gray-500 text-sm">
          {formatDateTime(summaryData.publishedAt)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {summaryData.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PaperInfo;
