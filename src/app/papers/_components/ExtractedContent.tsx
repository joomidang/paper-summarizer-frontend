"use client";

import React, { useState, KeyboardEvent } from "react";
import ContentItem from "./ContentItem";

const ExtractedContent: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["AI", "GPT"]);

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
              제목
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Lorem Ipsum is simply dummy text of the printing"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="author" className="block text-sm font-medium mb-1">
              저자
            </label>
            <input
              type="text"
              id="author"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="구성재, 김기현, 선지원"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              출판일
            </label>
            <input
              type="text"
              id="date"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="2025. 04. 10."
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
          <div className="mb-6 ">
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
          <button className="w-full py-2 bg-blue-700 text-white rounded font-medium">
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtractedContent;
