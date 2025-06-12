"use client";
import { useEffect, useState } from "react";
import {
  usePopularTags,
  useSearchSummaries,
  useTagSummaries,
} from "@/hooks/usePaperData";
import { useKeywordStore } from "@/store/keywordStore";

const Browsing = () => {
  const [mounted, setMounted] = useState(false);
  const { keyword } = useKeywordStore();
  const [clickedKeyword] = useState<string>("");
  const { data: searchResults } = useSearchSummaries(keyword);
  const { data: popularTags, isLoading: tagsLoading } = usePopularTags();

  const defaultTag = popularTags?.[0]?.name;
  const currentTag = clickedKeyword || defaultTag;
  const { data: tagSummaries } = useTagSummaries("AI");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log("현재 태그:", currentTag);
    console.log("검색 결과:", searchResults);
    console.log("인기 태그:", popularTags);
    console.log("태그 기반 조회:", tagSummaries);
  }, [searchResults, popularTags, tagSummaries, currentTag]);

  // 클라이언트에서 마운트되기 전까지는 아무것도 렌더링하지 않음
  if (!mounted) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div>
          <h1>인기 태그</h1>
          <span></span> {/* 빈 span으로 초기 렌더링 */}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div>
        <h1>인기 태그</h1>
        {tagsLoading ? (
          <span>로딩 중...</span>
        ) : (
          <span>
            {popularTags?.map((tag, index) => (
              <span key={index}>{tag.name} </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
};

export default Browsing;
