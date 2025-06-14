"use client";
import PopularSummary from "@/app/(main)/_components/PopularSummary";
import { useEffect } from "react";
import { useSearchSummaries } from "@/hooks/usePaperData";
import { useKeywordStore } from "@/store/keywordStore";
import { useState } from "react";

const Searching = () => {
  const [mounted, setMounted] = useState(false);
  const { keyword } = useKeywordStore();
  const { data: searchResults, isLoading } = useSearchSummaries(keyword);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("검색 키워드:", keyword);
    console.log("검색 결과:", searchResults);
  }, [searchResults, keyword]);

  if (!mounted) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold my-9">검색 결과</h1>
          <span className="text-white px-4 py-1 rounded-full">로딩 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        {keyword && (
          <div className=" w-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold my-9">
              총 {searchResults?.length || 0}건의 요약본을 찾았습니다.
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <span>검색 중...</span>
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6">
                {searchResults.map((summary: PopularSummary) => (
                  <PopularSummary key={summary.summaryId} summary={summary} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">검색 결과가 없습니다.</p>
                <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
              </div>
            )}
          </div>
        )}

        {/* 키워드가 없을 때 */}
        {!keyword && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">검색어를 입력해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searching;
