"use client";
import { formatTime } from "@/app/utils/formatDateTime";
import { UserInfo } from "@/types/userInfoType";
import Image from "next/image";
import { useState } from "react";
import { Comment } from "./CommentZone";

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

export default CommentItem;
