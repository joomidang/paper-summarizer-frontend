"use client";

import React, { useState, KeyboardEvent } from "react";
import ContentItem from "./ContentItem";
import { apiUrl } from "@/app/(auth)/_components/Login";
import { getCookie } from "@/app/utils/getCookie";
import { toast } from "react-toastify";
import { useSummaryStore } from "@/store/summaryStore";

interface ExtractedContentProps {
  summaryId: string;
}

const ExtractedContent: React.FC<ExtractedContentProps> = ({ summaryId }) => {
  const [isPublic, setIsPublic] = useState(true);
  //const [author, setAuthor] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { title, brief, markdownContent, tags, setTitle, setBrief, setTags } =
    useSummaryStore();

  console.log("ExtractedContent - store 상태:", {
    title,
    brief,
    markdownContent: markdownContent.substring(0, 100) + "...",
    tags,
  });

  const contentItems = [
    { type: "이미지" as const, number: 1, description: "Lorem Ipsum" },
    { type: "표" as const, number: 1, description: "Lorem Ipsum" },
    { type: "이미지" as const, number: 2, description: "Lorem Ipsum" },
    { type: "표" as const, number: 2, description: "Lorem Ipsum" },
  ];

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const saveDraftSummary = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!markdownContent.trim()) {
      toast.error("마크다운 내용이 없습니다. 에디터에서 내용을 작성해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        title: title.trim(),
        brief: brief.trim() || "요약 내용이 비어있습니다.",
        markdownContent: markdownContent,
        tags: tags,
      };

      console.log("Saving draft:", {
        summaryId,
        requestBody: {
          ...requestBody,
          markdownContent:
            requestBody.markdownContent.substring(0, 100) + "...",
        },
      });

      console.log(typeof +summaryId);

      const response = await fetch(
        `${apiUrl}/api/summaries/${summaryId}/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `초안 저장 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Draft saved successfully:", result);
      toast.success("요약이 임시 저장되었습니다.");
    } catch (error) {
      console.error("Draft saving error:", error);
      toast.error("임시 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const publishSummary = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }

    if (!markdownContent.trim()) {
      toast.error("마크다운 내용이 없습니다. 에디터에서 내용을 작성해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        title: title.trim(),
        brief: brief.trim() || "요약 내용이 비어있습니다.",
        markdownContent: markdownContent,
        tags: tags,
      };

      console.log("Publishing summary:", {
        summaryId,
        requestBody: {
          ...requestBody,
          markdownContent:
            requestBody.markdownContent.substring(0, 100) + "...",
        },
      });

      const response = await fetch(
        `${apiUrl}/api/summaries/${summaryId}/publish`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("accessToken")}`,
          },
          credentials: "include",
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Published 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Published successfully:", result);
      toast.success("요약이 성공적으로 출판되었습니다.");
      // router.push(`/papers/published/${summaryId}`);
    } catch (error) {
      console.error("Publishing error:", error);
      toast.error("출판 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[35.625rem]">
      <div>
        <div className="w-[35.625rem] bg-white rounded-lg border border-gray-300 p-4 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">추출된 콘텐츠</h2>
            <button className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 transition-colors">
              요소 추가
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            논문에서 자동으로 추출된 콘텐츠입니다.
            <br />
            드래그하여 원하는 섹션에 배치하세요.
          </p>
          <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {contentItems.map((item, index) => (
              <div
                key={index}
                className="relative bg-gray-100 rounded border border-gray-300 p-2 flex flex-col min-h-[120px]"
              >
                <ContentItem
                  key={index}
                  type={item.type}
                  number={item.number}
                  description={item.description}
                />
                <button className="absolute bottom-2 right-2 bg-gray-200 text-gray-700 text-xs px-3 py-1 mx-2 my-2 rounded shadow-sm hover:bg-gray-300 transition-colors">
                  배치됨
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[35.625rem] bg-white rounded-lg border border-gray-300 p-4 shadow-sm">
          <h2 className="text-lg font-bold mb-4">메타데이터</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Lorem Ipsum is simply dummy text of the printing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              저자
            </label>
            <input
              type="text"
              id="author"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="구성재, 김기현, 선지원"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div> */}
          <div className="mb-4">
            <label htmlFor="brief" className="block text-sm font-medium mb-1">
              초록
            </label>
            <textarea
              id="brief"
              rows={3}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="이 논문은 ···"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">공개 범위</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  className="w-4 h-4 text-blue-600 mr-2 accent-blue-600"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                <span className="text-sm">공개</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  className="w-4 h-4 text-blue-600 mr-2 accent-blue-600"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />
                <span className="text-sm">비공개</span>
              </label>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              태그
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex-grow flex min-w-0">
                <input
                  type="text"
                  id="tags"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="태그 입력 후 엔터"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
              </div>
              <button
                className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 ml-1"
                onClick={addTag}
                type="button"
                title="태그 추가"
              >
                +
              </button>
              <div className="flex flex-wrap gap-1 ml-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center px-3 h-8 bg-blue-100 text-blue-700 rounded cursor-pointer text-sm hover:bg-blue-200 transition-colors"
                    onClick={() => removeTag(index)}
                    title="클릭하여 삭제"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <button
              onClick={saveDraftSummary}
              className={`w-[47%] py-2 rounded font-medium transition-colors ${
                isLoading
                  ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                  : "bg-[#6b8fdc] text-white hover:bg-[#355174]"
              }`}
            >
              임시저장
            </button>
            <button
              onClick={publishSummary}
              disabled={isLoading}
              className={`w-[47%] py-2 rounded font-medium transition-colors ${
                isLoading
                  ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                  : "bg-[#42598C] text-white hover:bg-[#355174]"
              }`}
            >
              {isLoading ? "출판 중..." : "발행하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractedContent;
