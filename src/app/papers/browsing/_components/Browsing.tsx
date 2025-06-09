"use client";
import { usePopularTags, useSearchSummaries } from "@/hooks/usePaperData";
import { useKeywordStore } from "@/store/keywordStore";
import React, { useEffect } from "react";

const Browsing = () => {
  const { keyword } = useKeywordStore();
  const { data: searchResults } = useSearchSummaries(keyword);
  const { data: popularTags } = usePopularTags();

  useEffect(() => {
    console.log(searchResults, popularTags);
  }, [searchResults]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div>{popularTags?.map((tag) => tag.name)}</div>
    </div>
  );
};

export default Browsing;
