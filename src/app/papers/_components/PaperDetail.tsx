import { apiUrl } from "@/app/(auth)/_components/Login";
import { getCookie } from "@/app/utils/getCookie";
import { useFileStore } from "@/store/fileStore";
import React, { useEffect, useRef, useState } from "react";
import Summary from "./Summary";
import CommentZone from "./CommentZone";
import { SummaryData } from "@/types/summaryType";
import { useRecommendedSummaries } from "@/hooks/usePaperData";
import { useSummaryStore } from "@/store/summaryStore";

const PaperDetail = ({ summaryId }: { summaryId: string }) => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasRun = useRef(false);
  const { markdownUrl, setMarkdownUrl } = useFileStore();
  const { data: recommendedSummaries } = useRecommendedSummaries(summaryId);
  const { setAuthorName } = useSummaryStore();

  useEffect(() => {
    // 이미 실행된 경우 중복 실행 방지
    if (hasRun.current) return;

    const fetchSummaryData = async (summaryId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiUrl}/api/summaries/${summaryId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setSummaryData(result.data);
        setMarkdownUrl(result.data.markdownUrl);
        setAuthorName(result.data.authorName);
        console.log("요약본 불러오기 성공:", result.data);
      } catch (error) {
        console.error("요약본 데이터 가져오기 실패: ", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    hasRun.current = true;
    fetchSummaryData(summaryId);
  }, [summaryId]);

  useEffect(() => {
    console.log("추천 논문", recommendedSummaries);
  }, [recommendedSummaries]);

  // 로딩 중이거나 markdownUrl이 아직 없을 때
  if (loading || !markdownUrl || !summaryData) {
    return (
      <div className="flex justify-center items-center">
        논문 요약본을 불러오는 중...
      </div>
    );
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center pb-11 gap-4">
      <div className="flex justify-center items-start gap-4">
        <div className="bg-white shadow-sm rounded-lg border border-gray-300 xl:w-[43.125rem] max-h-[55.813rem] overflow-y-auto">
          <Summary initialMarkdownUrl={markdownUrl} />
        </div>
        <div>
          <CommentZone summaryId={summaryId} summaryData={summaryData} />
        </div>
      </div>
      <div className="w-[80rem]">
        <h1>추천 논문</h1>
      </div>
    </div>
  );
};

export default PaperDetail;
