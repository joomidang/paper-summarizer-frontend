"use client";

import { useUserInfoStore } from "@/store/userInfoStore";
import React, { useState, useEffect } from "react";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";
import Image from "next/image";

const MyPage = () => {
  const [summaries, setSummaries] = useState([]);
  const { userInfo, updateInterests } = useUserInfoStore();
  const [isClicked, setIsClicked] = useState<
    "summary" | "like" | "comment" | "interest"
  >("summary");

  useEffect(() => {
    const accessToken = getCookie("accessToken");

    const fetchSummaries = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/me/summaries`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("요약본 불러오기 실패");
        const response = await res.json();
        console.log("요약본 데이터:", response.data);
        setSummaries(response.data.content);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchInterests = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/me/interests`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });
        if (!res.ok) throw new Error("관심사 불러오기 실패");
        const response = await res.json();
        updateInterests(response.data.interests);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSummaries();
    fetchInterests();
  }, [updateInterests]);

  return (
    <div className="min-h-screen bg-[#FCFBF7]">
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow p-8 flex flex-col gap-4">
        <div className="flex items-center gap-6">
          <Image
            src={userInfo?.profileImageUrl || "/images/default-profile.png"}
            alt="profile"
            width={96}
            height={96}
            className="rounded-full flex-shrink-0"
          />
          <div>
            <div className="text-xl font-bold">{userInfo?.username}</div>
            <div className="text-gray-500 text-sm">loremipsumloremipsum</div>
            <div className="flex gap-4 mt-2 text-gray-700 text-sm">
              <span>팔로워 | 0</span>
              <span>팔로잉 | 0</span>
            </div>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 bg-[#1A2747] text-white rounded hover:bg-[#223366]">
              프로필 편집
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-semibold ${
              isClicked === "summary"
                ? "border-b-2 border-[#1A2747] text-[#1A2747]"
                : "text-gray-500 hover:text-[#1A2747]"
            }`}
            onClick={() => setIsClicked("summary")}
          >
            내 요약본
          </button>
          <button
            className={`px-6 py-3 font-semibold ${
              isClicked === "like"
                ? "border-b-2 border-[#1A2747] text-[#1A2747]"
                : "text-gray-500 hover:text-[#1A2747]"
            }`}
            onClick={() => setIsClicked("like")}
          >
            내가 좋아한 요약본
          </button>
          <button
            className={`px-6 py-3 font-semibold ${
              isClicked === "comment"
                ? "border-b-2 border-[#1A2747] text-[#1A2747]"
                : "text-gray-500 hover:text-[#1A2747]"
            }`}
            onClick={() => setIsClicked("comment")}
          >
            내가 쓴 댓글
          </button>
          <button
            className={`px-6 py-3 font-semibold ${
              isClicked === "interest"
                ? "border-b-2 border-[#1A2747] text-[#1A2747]"
                : "text-gray-500 hover:text-[#1A2747]"
            }`}
            onClick={() => setIsClicked("interest")}
          >
            내 연구 분야 및 관심사
          </button>
        </div>
      </div>

      {isClicked === "summary" && (
        <>
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 mt-6">
            {summaries &&
              summaries.map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-6 flex flex-col gap-2"
                >
                  <div className="flex gap-2 mb-2">
                    <span className="bg-[#E6EFFF] text-[#1A2747] text-xs px-2 py-1 rounded">
                      AI
                    </span>
                    <span className="bg-[#E6EFFF] text-[#1A2747] text-xs px-2 py-1 rounded">
                      GPT
                    </span>
                  </div>
                  <div className="font-semibold text-base">
                    GPT를 활용한 AI 논문 요약 및 시각화 플랫폼 개발
                  </div>
                  <div className="text-gray-400 text-xs">논문한입</div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <div className="flex gap-4">
                      <span>{}</span>
                      <span>3</span>
                    </div>
                    <span>Posted by {userInfo?.username}</span>
                  </div>
                </div>
              ))}
          </div>
          <div className="max-w-4xl mx-auto flex justify-center mt-8 mb-12">
            <div className="flex gap-4 text-gray-500">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    n === 1 ? "bg-[#1A2747] text-white" : "hover:bg-gray-200"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {isClicked === "like" && (
        <div className="max-w-4xl mx-auto mt-8">내가 좋아한 요약본 영역</div>
      )}
      {isClicked === "comment" && (
        <div className="max-w-4xl mx-auto mt-8">내가 쓴 댓글 영역</div>
      )}
      {isClicked === "interest" && (
        <div className="flex items-center justify-center max-w-4xl mx-auto mt-8 gap-2">
          {userInfo?.interests &&
            [...userInfo?.interests].map((interest) => (
              <div
                key={interest}
                className="bg-gray-200 rounded-full px-4 py-2"
              >
                {interest}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyPage;
