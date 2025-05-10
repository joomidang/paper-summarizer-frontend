"use client";
import React, { useEffect, useRef, useState } from "react";
import NotionEditor from "./NotionEditor";
import ExtractedContent from "./ExtractedContent";
import { apiUrl } from "@/app/(auth)/_components/Login";
import { getCookie } from "@/app/utils/getCookie";
import { useFileStore } from "@/store/fileStore";

interface PaperEditProps {
  summaryId: string;
}

interface SummaryData {
  markdownUrl: string;
  //[key: string]: any;
}

const PaperEdit = ({ summaryId }: PaperEditProps) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);
  const { markdownUrl, setMarkdownUrl } = useFileStore();

  console.log("summaryId:", summaryId);

  useEffect(() => {
    // 이미 실행된 경우 중복 실행 방지
    if (hasRun.current) return;

    const fetchSummaryData = async (summaryId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${apiUrl}/api/summaries/${summaryId}/edit`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getCookie("accessToken")}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setSummaryData(result.data);
        setMarkdownUrl(result.data.markdownUrl);
        console.log("요약 데이터 불러오기 성공:", result.data);
        console.log("markdownUrl:", result.data.markdownUrl);
      } catch (error) {
        console.error("요약 수정 데이터 가져오기 실패: ", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    hasRun.current = true;
    fetchSummaryData(summaryId);
  }, [summaryId]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4">요약 데이터를 불러오는 중...</span>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center p-4">
          <p>오류가 발생했습니다:</p>
          <p>{error}</p>
          <button
            onClick={() => {
              hasRun.current = false;
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // summaryData가 없거나 markdownUrl이 없는 경우
  if (!summaryData || !summaryData.markdownUrl) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-center p-4">
          <p>마크다운 URL을 찾을 수 없습니다.</p>
          <p>데이터: {JSON.stringify(summaryData)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pb-11 gap-4">
      <div className="bg-white shadow-sm rounded-lg border border-gray-300 xl:w-[43.125rem] max-h-[55.813rem] overflow-y-auto">
        <NotionEditor initialMarkdownUrl={markdownUrl} key={summaryId} />
      </div>
      <div>
        <ExtractedContent summaryId={summaryId} />
      </div>
    </div>
  );
};

export default PaperEdit;
