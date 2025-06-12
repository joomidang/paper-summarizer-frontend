"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  useUserComments,
  useUserInfo,
  useUserInterests,
  useUserLikes,
  useUserSummaries,
} from "@/hooks/useUserData";
import { Summary } from "@/types/summaryType";
import MySummary from "./MySummary";
import MyLikes from "./MyLikes";
import MyComment, { CommentData } from "./MyComment";

const MyPage = () => {
  const [isClient, setIsClient] = useState(false);
  const {
    data: userInfo,
    isLoading: userLoading,
    isError: userError,
  } = useUserInfo();
  const { data: interests, isLoading: interestsLoading } = useUserInterests();
  const { data: summaries, isLoading: summariesLoading } = useUserSummaries();
  const { data: likes, isLoading: likesLoading } = useUserLikes();
  const { data: comments, isLoading: commentsLoading } = useUserComments();

  const [isClicked, setIsClicked] = useState<
    "summary" | "like" | "comment" | "interest"
  >("summary");

  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log("comments:", comments);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (userError || !userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>사용자 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }

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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default-profile.png";
            }}
          />
          <div>
            <div className="text-xl font-bold">
              {userInfo?.username || "사용자"}
            </div>
            <div className="text-gray-500 text-sm invisible">
              loremipsumloremipsum
            </div>
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
          {summariesLoading ? (
            <div className="max-w-4xl mx-auto mt-8 text-center mb-8">
              요약본을 불러오는 중...
            </div>
          ) : summaries && summaries.length > 0 ? (
            <>
              <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6 mt-6">
                {summaries.map((summary: Summary) => (
                  <MySummary key={summary.summaryId} summary={summary} />
                ))}
              </div>
              <div className="max-w-4xl mx-auto flex justify-center mt-8 mb-12">
                <div className="flex gap-4 text-gray-500">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        n === 1
                          ? "bg-[#1A2747] text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto mt-8 text-center text-gray-500">
              아직 작성한 요약본이 없습니다.
            </div>
          )}
        </>
      )}

      {isClicked === "like" && (
        <div className="max-w-4xl mx-auto mt-8 mb-8">
          {likesLoading ? (
            <div className="text-center">좋아요를 불러오는 중...</div>
          ) : likes && likes.likes.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {likes.likes.map((like: Summary) => (
                <MyLikes key={like.summaryId} summary={like} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              좋아한 요약본이 없습니다.
            </div>
          )}
        </div>
      )}

      {isClicked === "comment" && (
        <div className="max-w-4xl mx-auto mt-8 mb-8">
          {commentsLoading ? (
            <div className="text-center">댓글을 불러오는 중...</div>
          ) : comments?.content && comments.content.length > 0 ? (
            <div className="grid grid-cols-2 gap-6">
              {comments.content.map((comment: CommentData) => (
                <MyComment key={comment.commentId} comment={comment} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">댓글이 없습니다.</div>
          )}
        </div>
      )}

      {isClicked === "interest" && (
        <div className="max-w-4xl mx-auto mt-8">
          {interestsLoading ? (
            <div className="text-center">관심사를 불러오는 중...</div>
          ) : interests && interests.length > 0 ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {interests.map((interest: string, index: number) => (
                <div
                  key={`${interest}-${index}`}
                  className="bg-gray-200 rounded-full px-4 py-2"
                >
                  {interest}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              등록된 관심사가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPage;
