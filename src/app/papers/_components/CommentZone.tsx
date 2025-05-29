// import React, { useState } from "react";
// import { getCookie } from "@/app/utils/getCookie";
// import { apiUrl } from "@/app/(auth)/_components/Login";

// interface CommentZoneProps {
//   summaryId: string;
// }

// interface Comment {
//   commentId: number;
//   content: string;
//   createdAt: string;
//   isMine: boolean;
//   author: {
//     id: number;
//     username: string;
//     profileImageUrl: string;
//   };
// }

// const CommentZone = ({ summaryId }: CommentZoneProps) => {
//   const [comment, setComment] = useState<string>("");
//   const [comments, setComments] = useState<Comment[]>([]);

//   const handleCommentSubmit = async () => {
//     if (!comment.trim()) return;

//     try {
//       console.log("댓글 작성");

//       const response = await fetch(
//         `${apiUrl}/api/summaries/${summaryId}/comments`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${getCookie("accessToken")}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ content: comment }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("댓글 작성 실패");
//       }

//       const newComment = await response.json();

//       setComments((prev) => [...prev, newComment]);
//       setComment("");
//     } catch (error) {
//       console.error("댓글 작성 에러:", error);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleCommentSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen w-[35.625rem]">
//       <div className="w-[35.625rem] min-h-screen bg-white rounded-lg border border-gray-300 p-4 mb-4 shadow-sm flex flex-col justify-between">
//         <div className="flex flex-col">
//           <div className="font-bold text-lg mb-4">
//             {comments.length}개의 댓글
//           </div>
//           <div className="space-y-6">
//             {comments.map((commentItem) => (
//               <div
//                 key={commentItem?.commentId}
//                 className="flex items-start gap-4"
//               >
//                 <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
//                 <div>
//                   {/* <div className="font-semibold text-base">
//                     {commentItem.author.username}
//                   </div> */}
//                   <div className="text-gray-500 text-sm">
//                     {commentItem.content}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-col gap-3 mt-6 border-t pt-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
//             <div className="flex-1">
//               <input
//                 type="text"
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="댓글을 입력하세요"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               />
//             </div>
//           </div>
//           <div className="flex justify-end">
//             <button
//               onClick={handleCommentSubmit}
//               disabled={!comment.trim()}
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//             >
//               작성
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CommentZone;
"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";
import Image from "next/image";
import { toast } from "react-toastify";
import { formatTime } from "@/app/utils/formatDateTime";
import { useUserInfo } from "@/hooks/useUserData";

interface CommentZoneProps {
  summaryId: string;
}

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  isMine: boolean;
  author: {
    id: number;
    name: string;
    profileImage: string;
  };
}

interface CommentResponse {
  data: Comment[];
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
  console.log("댓글 응답:", result); // 디버깅용

  // 응답 구조에 따라 적절히 처리
  if (result.data) {
    return result.data.comments;
  } else if (Array.isArray(result)) {
    return result;
  } else {
    console.warn("예상과 다른 응답 구조:", result);
    return [];
  }
};

// 댓글 작성 API
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

// 댓글 삭제 API
const deleteComment = async ({
  summaryId,
  commentId,
}: {
  summaryId: string;
  commentId: number;
}): Promise<void> => {
  const response = await fetch(
    `${apiUrl}/api/summaries/${summaryId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("댓글 삭제 실패");
  }
};

const CommentZone = ({ summaryId }: CommentZoneProps) => {
  const { userInfo } = useUserInfo();
  const [comment, setComment] = useState<string>("");
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
    staleTime: 30 * 1000, // 30초
  });

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", summaryId],
      });
      setComment("");
    },
    onError: (error) => {
      console.error("댓글 작성 에러:", error);
      toast.error("댓글 작성에 실패했습니다.");
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

    createCommentMutation.mutate({
      summaryId,
      content: comment.trim(),
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
              : `${Array.isArray(comments) ? comments.length : 0}개의 댓글`}
          </div>

          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">댓글을 불러오는 중...</div>
            ) : Array.isArray(comments) && comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </div>
            ) : Array.isArray(comments) ? (
              comments.map((commentItem, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Image
                    src={commentItem.author.profileImage}
                    alt={`${commentItem.author.name} 프로필`}
                    width={48}
                    height={48}
                    priority={true}
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
                          {commentItem.author.name}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatTime(commentItem.createdAt)}
                        </div>
                      </div>
                      {commentItem.isMine && (
                        <button
                          onClick={() =>
                            handleDeleteComment(commentItem.commentId)
                          }
                          disabled={deleteCommentMutation.isPending}
                          className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm mt-1">
                      {commentItem.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-red-500">
                댓글 데이터를 불러올 수 없습니다.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6 border-t pt-4">
          <div className="flex items-center gap-3">
            <Image
              src={userInfo?.profileImageUrl}
              alt="프로필 이미지"
              width={48}
              height={48}
              priority={true}
            />
            <div className="flex-1">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="댓글을 입력하세요"
                disabled={createCommentMutation.isPending}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCommentSubmit}
              disabled={!comment.trim() || createCommentMutation.isPending}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {createCommentMutation.isPending ? "작성 중..." : "작성"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentZone;
