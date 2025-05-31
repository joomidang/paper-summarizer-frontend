"use client";
import Image from "next/image";
import React from "react";
import { useUserInfo } from "@/hooks/useUserData";

const MyPageLayout = () => {
  const { data: userInfo } = useUserInfo();
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        <div className="flex items-center justify-between pt-7">
          <h1 className="text-3xl font-bold">
            {userInfo?.username}&apos;s paper
          </h1>
          <Image
            src={userInfo?.profileImageUrl || "/images/default-profile.png"}
            alt="profile"
            width={45}
            height={45}
            className="cursor-pointer rounded-full"
          />
        </div>
        <div className="w-[80rem] h-px bg-[#000000] my-7" />
      </div>
    </div>
  );
};

export default MyPageLayout;
