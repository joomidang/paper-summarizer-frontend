"use client";
import React, { useEffect, useRef, useState } from "react";
import NotionEditor from "./NotionEditor";
import ExtractedContent from "./ExtractedContent";
import { apiUrl } from "@/app/(auth)/_components/Login";
import { markdown } from "@yoopta/exports";
import { getCookie } from "@/app/utils/getCookie";

interface PaperEditProps {
  summaryId: string;
}

const PaperEdit = ({ summaryId }: PaperEditProps) => {
  const [summaryData, setSummaryData] = useState(null);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  //const { accessToken } = useAuthStore();
  const hasRun = useRef(false);
  console.log(summaryId);

  // useEffect(() => {
  //   const fetchSummaryData = async () => {
  //     try {
  //       const response = await fetch(`${apiUrl}/api/summaries/3/edit`, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${getCookie("accessToken")}`,
  //         },
  //         credentials: "include",
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setSummaryData(data);
  //       console.log("요약 데이터 불러오기 성공:", data);
  //       return data;
  //     } catch (error) {
  //       console.error("요약 수정 데이터 가져오기 실패: ", error);
  //       throw error;
  //     }
  //   };

  //   hasRun.current = true;
  //   fetchSummaryData();
  // }, []);

  return (
    <div className="flex justify-center items-start pb-11 gap-4">
      <div className="bg-white shadow-sm rounded-lg border border-gray-300 xl:w-[43.125rem] max-h-[50.938rem] overflow-y-auto">
        <NotionEditor />
      </div>
      <div>
        <ExtractedContent />
      </div>
    </div>
  );
};

export default PaperEdit;
