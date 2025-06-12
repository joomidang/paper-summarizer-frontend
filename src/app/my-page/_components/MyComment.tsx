"use client";
import { useRouter } from "next/navigation";
import React from "react";

export interface CommentData {
  commentId: number;
  content: string;
  createdAt: string;
  summaryId: number;
  summaryTitle: string;
}

interface MyCommentProps {
  comment: CommentData;
}

const MyComment = ({ comment }: MyCommentProps) => {
  const router = useRouter();
  return (
    <div
      key={comment.commentId}
      onClick={() => router.push(`/papers/published/${comment.summaryId}`)}
      className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="text-gray-500 text-sm">{comment.summaryTitle}</div>
      <div className="text-gray-400 text-xs">{comment.createdAt}</div>
      <div className="text-gray-700 text-base mt-2">{comment.content}</div>
    </div>
  );
};

export default MyComment;
