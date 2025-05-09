// components/ContentItem.tsx
"use client";

import React from "react";

interface ContentItemProps {
  type: "이미지" | "표";
  number: number;
  description: string;
}

const ContentItem: React.FC<ContentItemProps> = ({
  type,
  number,
  description,
}) => {
  return (
    <div className="border border-gray-300 rounded p-2">
      <p className="text-sm font-bold mb-2">{type}</p>
      <div className="bg-gray-200 h-24 mb-2"></div>
      <div className="flex justify-between items-center">
        <span className="text-sm">
          {type} {number}: {description}
        </span>
      </div>
    </div>
  );
};

export default ContentItem;
