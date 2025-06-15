"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useUserInfo } from "@/hooks/useUserData";

const UploadLayout = () => {
  const pathname = usePathname();
  const isAnalyze = pathname.includes("analyze");
  const isEdit = pathname.includes("edit");
  const { data: userInfo } = useUserInfo();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center justify-between pt-7 min-w-[80rem]">
        <h1 className="text-3xl font-bold">
          {isAnalyze
            ? "논문 분석"
            : isEdit
            ? "논문 요약본 편집"
            : "논문 업로드"}
        </h1>
        <Image
          src={userInfo?.profileImageUrl || "/images/default-profile.png"}
          alt="profile"
          width={45}
          height={45}
          className="cursor-pointer rounded-full"
          onClick={() => router.push(`/my-page`)}
        />
      </div>
      <div className="w-[80rem] h-px bg-[#000000] my-8" />
    </div>
  );
};

export default UploadLayout;
