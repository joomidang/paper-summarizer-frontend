"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";
import Image from "next/image";
import { toast } from "react-toastify";
import { formatTime } from "@/app/utils/formatDateTime";
import { useUserInfo } from "@/hooks/useUserData";
import { UserInfo } from "@/types/userInfoType";

interface CommentZoneProps {
  summaryId: string;
}

interface Comment {
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

// 댓글 목록 조회 API
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

// 일반 댓글 작성 API
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

// 대댓글 작성 API
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

//댓글 수정 API
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

// 댓글 삭제 API
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

const CommentItem = ({
  comment,
  summaryId,
  onReply,
  onUpdate,
  onDelete,
  userInfo,
}: {
  comment: Comment;
  summaryId: string;
  onReply: (
    parentId: number,
    parentAuthor: string,
    parentContent: string
  ) => void;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  userInfo: UserInfo;
}) => {
  const [showReplies, setShowReplies] = useState(true);
  const isMine = userInfo?.id === comment.author.id;

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Image
          src={comment.author.profileImage || "/images/default-profile.png"}
          alt={`${comment.author.name} 프로필`}
          width={48}
          height={48}
          className="rounded-full flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/default-profile.png";
          }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-base">
                {comment.author.name}
              </div>
              <div className="text-gray-400 text-xs">
                {formatTime(comment.createdAt)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  onReply(comment.id, comment.author.name, comment.content)
                }
                className="text-blue-500 text-sm hover:text-blue-700"
              >
                답글
              </button>
              {isMine && (
                <button
                  onClick={() => onUpdate(comment.id, comment.content)}
                  className="text-gray-500 text-sm hover:text-gray-700"
                >
                  수정
                </button>
              )}
              {isMine && (
                <button
                  onClick={() => onDelete(comment.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
          <div className="text-gray-700 text-sm mt-1">{comment.content}</div>

          {/* 대댓글 토글 */}
          {comment.children && comment.children.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-500 text-sm mt-2 hover:text-blue-700"
            >
              {showReplies ? "▼" : "▶"} 답글 {comment.children.length}개{" "}
              {showReplies ? "숨기기" : "보기"}
            </button>
          )}
        </div>
      </div>

      {/* 대댓글들 (들여쓰기) */}
      {showReplies && comment.children && comment.children.length > 0 && (
        <div className="ml-12 space-y-4 border-l-2 border-gray-100 pl-4">
          {comment.children.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              summaryId={summaryId}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              userInfo={userInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentZone = ({ summaryId }: CommentZoneProps) => {
  const { data: userInfo } = useUserInfo();
  const [comment, setComment] = useState<string>("");
  const [replyTo, setReplyTo] = useState<{
    id: number;
    name: string;
    content: string;
  } | null>(null);
  const queryClient = useQueryClient();

  // 댓글 목록 조회
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
      // 대댓글 작성
      createReplyMutation.mutate({
        summaryId,
        commentId: replyTo.id,
        content: comment.trim(),
      });
    } else {
      // 일반 댓글 작성
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

  // 전체 댓글 개수 계산 (대댓글 포함)
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
    <div className="min-h-screen w-[35.625rem]">
      <div className="w-[35.625rem] min-h-screen bg-white rounded-lg border border-gray-300 p-4 mb-4 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="font-bold text-lg mb-4">
            {isLoading
              ? "로딩 중..."
              : `${
                  Array.isArray(comments) ? getTotalCommentCount(comments) : 0
                }개의 댓글`}
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

        <div className="flex flex-col gap-3 mt-6 border-t pt-4">
          {/* 답글 작성 중일 때 원본 댓글 표시 */}
          {replyTo && (
            <div className="bg-gray-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 font-medium text-sm">
                      {replyTo.name}님의 댓글에 답글 작성 중
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
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  replyTo
                    ? `${replyTo.name}님에게 답글...`
                    : "댓글을 입력하세요"
                }
                disabled={
                  createCommentMutation.isPending ||
                  createReplyMutation.isPending
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCommentSubmit}
              disabled={
                !comment.trim() ||
                createCommentMutation.isPending ||
                createReplyMutation.isPending
              }
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
