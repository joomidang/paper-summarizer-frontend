"use client";
import { useEffect, useState } from "react";
import {
  usePopularTags,
  useSearchSummaries,
  useTagSummaries,
} from "@/hooks/usePaperData";
import { useKeywordStore } from "@/store/keywordStore";
import PopularSummary from "@/app/(main)/_components/PopularSummary";

const Browsing = () => {
  const [mounted, setMounted] = useState(false);
  const { keyword } = useKeywordStore();
  const { data: searchResults } = useSearchSummaries(keyword);
  const { data: popularTags, isLoading: tagsLoading } = usePopularTags();
  const [clickedKeyword, setClickedKeyword] = useState<string>("");

  useEffect(() => {
    if (popularTags && popularTags.length > 0 && !clickedKeyword) {
      setClickedKeyword(popularTags[0].name);
    }
  }, [popularTags, clickedKeyword]);

  const currentTag = clickedKeyword || popularTags?.[0]?.name || "";
  const { data: tagSummaries, isLoading: summariesLoading } =
    useTagSummaries(currentTag);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("현재 태그:", currentTag);
    console.log("클릭된 키워드:", clickedKeyword);
    console.log("검색 결과:", searchResults);
    console.log("인기 태그:", popularTags);
    console.log("태그 기반 조회:", tagSummaries);
  }, [searchResults, popularTags, tagSummaries, currentTag, clickedKeyword]);

  const handleTagClick = (tagName: string) => {
    console.log("태그 클릭:", tagName);
    setClickedKeyword(tagName);
  };

  if (!mounted) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold my-9">인기 태그</h1>
          <span className="text-white px-4 py-1 rounded-full "></span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold my-9">인기 태그</h1>
        {tagsLoading ? (
          <span>태그 로딩 중...</span>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {popularTags?.map((tag, index) => (
              <span
                onClick={() => handleTagClick(tag.name)}
                key={index}
                className={`flex items-center justify-center cursor-pointer text-white px-4 py-1 rounded-full transition-colors ${
                  tag.name === clickedKeyword ? "bg-[#42598C]" : "bg-[#898989]"
                }`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 검색 결과 표시 */}

        {/* 태그 기반 요약본 표시 */}
        <div className="mt-6 w-full">
          {summariesLoading ? (
            <div className="text-center py-8">
              {/* <span>요약본 로딩 중...</span> */}
            </div>
          ) : tagSummaries && tagSummaries.length > 0 ? (
            <div className="max-w-7xl mx-auto grid grid-cols-2 gap-6 mt-6">
              {tagSummaries.map((summary: PopularSummary) => (
                <PopularSummary key={summary.summaryId} summary={summary} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              해당 태그의 요약본이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browsing;
