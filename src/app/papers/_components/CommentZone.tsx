"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";
import Image from "next/image";
import { toast } from "react-toastify";
import { useUserInfo } from "@/hooks/useUserData";
import CommentItem from "./CommentItem";

interface CommentZoneProps {
  summaryId: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string | null;
  parentId: number | null;
  likeCount: number;
  author: {
    id: number;
    name: string;
    profileImage: string;
  };
  children: Comment[];
}

const fetchComments = async (summaryId: string): Promise<Comment[]> => {
  const response = await fetch(
    `${apiUrl}/api/summaries/${summaryId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("댓글 조회 실패");
  }

  const result = await response.json();
  console.log("댓글 응답:", result);

  if (result.data) {
    return result.data.comments;
  } else if (Array.isArray(result)) {
    return result;
  } else {
    console.warn("예상과 다른 응답 구조:", result);
    return [];
  }
};

const createComment = async ({
  summaryId,
  content,
}: {
  summaryId: string;
  content: string;
}): Promise<Comment> => {
  const response = await fetch(
    `${apiUrl}/api/summaries/${summaryId}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("댓글 작성 실패");
  }

  return response.json();
};

const createReply = async ({
  summaryId,
  commentId,
  content,
}: {
  summaryId: string;
  commentId: number;
  content: string;
}): Promise<Comment> => {
  const response = await fetch(
    `${apiUrl}/api/summaries/${summaryId}/comments/${commentId}/replies`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("대댓글 작성 실패");
  }

  return response.json();
};

const updateComment = async ({
  commentId,
  content,
}: {
  commentId: number;
  content: string;
}): Promise<void> => {
  const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getCookie("accessToken")}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("댓글 수정 실패");
  }
};

const deleteComment = async ({
  commentId,
}: {
  summaryId: string;
  commentId: number;
}): Promise<void> => {
  const response = await fetch(`${apiUrl}/api/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("accessToken")}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("댓글 삭제 실패");
  }
};

const CommentZone = ({ summaryId }: CommentZoneProps) => {
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const [comment, setComment] = useState<string>("");
  const [replyTo, setReplyTo] = useState<{
    id: number;
    name: string;
    content: string;
  } | null>(null);

  const {
    data: comments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["comments", summaryId],
    queryFn: () => fetchComments(summaryId),
    enabled: !!summaryId,
    staleTime: 30 * 1000,
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", summaryId],
      });
      setComment("");
      setReplyTo(null);
    },
    onError: (error) => {
      console.error("댓글 작성 에러:", error);
      toast.error("댓글 작성에 실패했습니다.");
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: createReply,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", summaryId],
      });
      setComment("");
      setReplyTo(null);
    },
    onError: (error) => {
      console.error("대댓글 작성 에러:", error);
      toast.error("대댓글 작성에 실패했습니다.");
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", summaryId],
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", summaryId],
      });
    },
    onError: (error) => {
      console.error("댓글 삭제 에러:", error);
      toast.error("댓글 삭제에 실패했습니다.");
    },
  });

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    if (replyTo) {
      createReplyMutation.mutate({
        summaryId,
        commentId: replyTo.id,
        content: comment.trim(),
      });
    } else {
      createCommentMutation.mutate({
        summaryId,
        content: comment.trim(),
      });
    }
  };

  const handleReply = (
    parentId: number,
    parentAuthor: string,
    parentContent: string
  ) => {
    setReplyTo({ id: parentId, name: parentAuthor, content: parentContent });
    setComment(`@${parentAuthor} `);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setComment("");
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    updateCommentMutation.mutate({
      commentId,
      content,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate({
        summaryId,
        commentId,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCommentSubmit();
    }
  };

  const getTotalCommentCount = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return (
        total +
        1 +
        (comment.children ? getTotalCommentCount(comment.children) : 0)
      );
    }, 0);
  };

  if (isError) {
    return (
      <div className="min-h-screen w-[35.625rem] flex items-center justify-center">
        <div className="text-red-500">
          댓글을 불러오는데 실패했습니다: {error?.message}
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen w-[35.625rem] ">
      <div className="w-[35.625rem] max-h-screen min-h-[44rem] bg-white rounded-lg border border-gray-300 p-4 mb-4 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col">
          <div>
            {/* <div>토글 하트버튼</div> */}
            <div className="font-bold text-lg mb-4">
              {isLoading
                ? "로딩 중..."
                : `${
                    Array.isArray(comments) ? getTotalCommentCount(comments) : 0
                  }개의 댓글`}
            </div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">댓글을 불러오는 중...</div>
            ) : Array.isArray(comments) && comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </div>
            ) : Array.isArray(comments) ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  summaryId={summaryId}
                  onReply={handleReply}
                  onUpdate={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  userInfo={userInfo}
                />
              ))
            ) : (
              <div className="text-center py-8 text-red-500">
                댓글 데이터를 불러올 수 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        {/* 대댓글 작성 중일 때 원본 댓글 표시 */}
        {replyTo && (
          <div className="bg-gray-50 border-l-4 border-[#42598C] p-4 rounded">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#12398e] font-medium text-sm">
                    {replyTo.name}님의 댓글에 답글 작성중...
                  </span>
                </div>
                <div className="bg-white p-3 rounded border text-gray-700 text-sm">
                  {replyTo.content.length > 100
                    ? `${replyTo.content.substring(0, 100)}...`
                    : replyTo.content}
                </div>
              </div>
              <button
                onClick={handleCancelReply}
                className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0"
                title="답글 취소"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Image
            src={userInfo?.profileImageUrl || "/images/default-profile.png"}
            alt="프로필 이미지"
            width={48}
            height={48}
            className="rounded-full flex-shrink-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/default-profile.png";
            }}
          />
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                replyTo ? `${replyTo.name}님에게 답글...` : "댓글을 입력하세요"
              }
              disabled={
                createCommentMutation.isPending || createReplyMutation.isPending
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#42598C] focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              onClick={handleCommentSubmit}
              disabled={
                !comment.trim() ||
                createCommentMutation.isPending ||
                createReplyMutation.isPending
              }
              className="px-6 py-2 bg-[#42598C] text-white rounded-lg hover:bg-[#304268] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {createCommentMutation.isPending || createReplyMutation.isPending
                ? "작성 중..."
                : replyTo
                ? "답글 작성"
                : "작성"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentZone;
