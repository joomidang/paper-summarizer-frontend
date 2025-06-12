"use client";
import Image from "next/image";
import React from "react";
import { useUserInfo } from "@/hooks/useUserData";
import { IoSearchOutline } from "react-icons/io5";
import { useKeywordStore } from "@/store/keywordStore";
import { useSearchSummaries } from "@/hooks/usePaperData";
import { useRouter } from "next/navigation";

const HomeLayout = () => {
  const { data: userInfo } = useUserInfo();
  const { keyword, setKeyword } = useKeywordStore();
  const router = useRouter();
  const { data: searchResults } = useSearchSummaries(keyword);
  console.log(searchResults);

  return (
    <div className="w-full bg-[#F6F5F1] flex flex-col items-center justify-center ">
      <div className="border-b border-[#000000]">
        <div>
          <div className="flex items-center justify-between pt-7 ">
            <h1 className="ml-1.5 font-[HakgyoansimMulgyeol] text-[1.97rem] text-[#2A437B]">
              논문한입
            </h1>
            <div className="flex items-center relative">
              <IoSearchOutline className="text-2xl absolute left-2 text-gray-500" />
              <input
                type="text"
                placeholder="논문 키워드 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/papers/browsing`);
                  }
                }}
                className="w-[25rem] h-[2.5rem] rounded-full border border-gray-500 shadow- bg-gray-100 pl-9 mr-5 focus:outline-0 focus:bg-gray-200"
              />
              <Image
                src={userInfo?.profileImageUrl || "/images/default-profile.png"}
                alt="profile"
                width={45}
                height={45}
                className="cursor-pointer rounded-full"
                onClick={() => router.push("/my-page")}
              />
            </div>
          </div>
          <div className="w-[80rem] my-7" />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
