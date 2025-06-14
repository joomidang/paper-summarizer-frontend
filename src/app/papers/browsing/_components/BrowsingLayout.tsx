"use client";
import Image from "next/image";
import React from "react";
import { useUserInfo } from "@/hooks/useUserData";
import { IoSearchOutline } from "react-icons/io5";
import { useKeywordStore } from "@/store/keywordStore";
import { useSearchSummaries } from "@/hooks/usePaperData";
import { useRouter } from "next/navigation";

const BrowsingLayout = () => {
  const { data: userInfo } = useUserInfo();
  const { keyword, setKeyword } = useKeywordStore();
  const { refetch } = useSearchSummaries(keyword);
  const router = useRouter();

  const handleSearch = (keyword: string) => {
    if (keyword.trim()) {
      refetch();
      router.push(`/papers/browsing/search/${keyword}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center ">
      <div className="border-b border-[#000000]">
        <div>
          <div className="flex items-center justify-between pt-7 ">
            <h1 className="text-3xl font-bold">논문 둘러보기</h1>
            <div className="flex items-center relative">
              <IoSearchOutline className="text-2xl absolute left-2 text-gray-500" />
              <input
                type="text"
                placeholder="논문 키워드 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(keyword);
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
              />
            </div>
          </div>
          <div className="w-[80rem] my-7" />
        </div>
      </div>
    </div>
  );
};

export default BrowsingLayout;
