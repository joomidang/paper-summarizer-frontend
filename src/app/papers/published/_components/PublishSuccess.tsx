"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFileStore } from "@/store/fileStore";

const PublishSuccess = () => {
  const router = useRouter();
  const { summaryId } = useFileStore();

  const handleMoveToSummary = () => {
    router.push(`/papers/published/${summaryId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 bg-[#fcfbf6]">
      <div className="bg-white border border-gray-200 rounded-xl p-8  w-full min-w-[35.625rem] xl:w-[80rem] flex flex-col items-center shadow">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-[#e6f0fa] rounded-full p-4 mb-6 mt-6">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#6b8fdc" />
              <path
                d="M8 12.5l3 3 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            논문 요약본 업로드 완료
          </h2>
          <div className="bg-[#c9d7f5] text-[#5978ba] rounded-lg px-6 py-3 text-center text-lg font-medium w-[30rem] xl:w-[40rem]">
            요약본이 성공적으로 저장되었습니다.
            <br />
            이제 논문한입에서 다른 연구자들과 함께 소통해보세요!
          </div>
        </div>
        <button
          onClick={handleMoveToSummary}
          className="mt-6 mb-5 w-[40rem] bg-[#42598C] text-white py-3 rounded-lg font-semibold text-lg hover:bg-[#355174] transition-colors"
        >
          요약본으로 이동
        </button>
      </div>
    </div>
  );
};

export default PublishSuccess;
