"use client";
import React from "react";
import NotionEditor from "./NotionEditor";
import ExtractedContent from "./ExtractedContent";

const PaperEdit = () => {
  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white border-[1px] xl:w-[43.125rem] min-h-[50.938rem]">
        <NotionEditor />
      </div>
      <div>
        <ExtractedContent />
      </div>
    </div>
  );
};

export default PaperEdit;
