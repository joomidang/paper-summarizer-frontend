"use client";
import React from "react";
import NotionEditor from "./NotionEditor";
import ExtractedContent from "./ExtractedContent";

const PaperEdit = () => {
  return (
    <div className="flex justify-center items-start pb-11 gap-4">
      <div className="bg-white shadow-sm rounded-lg border border-gray-300 xl:w-[43.125rem] min-h-[50.938rem]">
        <NotionEditor />
      </div>
      <div>
        <ExtractedContent />
      </div>
    </div>
  );
};

export default PaperEdit;
