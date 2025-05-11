"use client";
import React from "react";
import { usePathname } from "next/navigation";

const PublishedLayout = () => {
  const pathname = usePathname();
  const isSuccess = pathname.includes("success");
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold mt-8">
          {/**사용자 이름's paper로 수정 필요 */}
          {isSuccess ? "논문 업로드 완료" : "oneieo's paper"}
        </h1>
        <div className="w-[80rem] h-px bg-[#000000] my-8" />
      </div>
    </div>
  );
};

export default PublishedLayout;
