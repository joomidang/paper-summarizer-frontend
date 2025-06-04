import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";

interface Like {
  id: number;
  summaryId: string;
  userId: number;
  createdAt: string;
}

// 사용자 정보 조회
const fetchUserInfo = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("사용자 정보 불러오기 실패");
  const result = await response.json();
  return result.data || {};
};

// 사용자 요약본 조회
const fetchUserSummaries = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me/summaries`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("요약본 불러오기 실패");
  const result = await response.json();
  return result.data?.content || [];
};

// 사용자 관심사 조회
const fetchUserInterests = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me/interests`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("관심사 불러오기 실패");
  const result = await response.json();
  return result.data?.interests || [];
};

// 사용자 좋아요 조회
const fetchUserLikes = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me/likes`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("좋아요 불러오기 실패");
  const result = await response.json();
  return result.data || [];
};

// 사용자 댓글 조회
const fetchUserComments = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me/comments`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("댓글 불러오기 실패");
  const result = await response.json();
  return result.data || [];
};

// 요약본 좋아요 토글
const toggleSummaryLike = async (
  summaryId: string,
  currentLikeCount: number
) => {
  const action = currentLikeCount > 0 ? "dislike" : "like";

  const response = await fetch(
    `${apiUrl}/api/summaries/${summaryId}/like?action=${action}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to ${action} summary`);
  }

  // 서버에서 { likeCount: number, liked: boolean } 형태로 응답한다고 가정
  return response.json();
};

// 댓글 좋아요/취소 API
const toggleCommentLike = async ({
  commentId,
  action,
}: {
  commentId: number;
  action: "like" | "dislike";
}) => {
  const response = await fetch(
    `${apiUrl}/api/comments/${commentId}/like?action=${action}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to ${action} comment`);
  }

  return response.json();
};

// 훅들
export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
  });
};

export const useUserSummaries = () => {
  return useQuery({
    queryKey: ["userSummaries"],
    queryFn: fetchUserSummaries,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUserInterests = () => {
  return useQuery({
    queryKey: ["userInterests"],
    queryFn: fetchUserInterests,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useSummaryLike = (
  summaryId: string,
  callbacks?: {
    onSuccess?: (data: { likeCount: number; liked: boolean }) => void;
    onError?: (error: Error) => void;
  }
) => {
  const queryClient = useQueryClient();

  const {
    mutate: toggleLike,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (currentLikeCount: number) =>
      toggleSummaryLike(summaryId, currentLikeCount),
    onSuccess: (data) => {
      // 서버 응답 데이터로 상태 업데이트
      if (data && data.likeCount !== undefined) {
        // 좋아요 상태 즉시 업데이트
        queryClient.setQueryData(
          ["userLikes"],
          (oldData: Like[] | undefined) => {
            if (!oldData) return [];
            const isLiked = data.liked; // liked 필드 사용
            const existingLike = oldData.find(
              (like) => like.summaryId === summaryId
            );

            if (isLiked && !existingLike) {
              return [...oldData, { summaryId, id: Date.now() }];
            } else if (!isLiked && existingLike) {
              return oldData.filter((like) => like.summaryId !== summaryId);
            }
            return oldData;
          }
        );

        // 사용자 정의 콜백 실행
        callbacks?.onSuccess?.(data);
      }

      // 관련 쿼리 무효화
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["userLikes"] }),
        queryClient.invalidateQueries({ queryKey: ["summary", summaryId] }),
      ]);
    },
    onError: (error) => {
      console.error("좋아요 토글 실패:", error);
      callbacks?.onError?.(error);
    },
  });

  return {
    toggleLike,
    isLoading,
    error,
  };
};

export const useUserLikes = (summaryId?: string) => {
  const { data: likes = [], ...rest } = useQuery({
    queryKey: ["userLikes"],
    queryFn: fetchUserLikes,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isLiked = summaryId
    ? likes.some((like: Like) => like.summaryId === summaryId)
    : false;
  const likeCount = summaryId
    ? likes.filter((like: Like) => like.summaryId === summaryId).length
    : 0;

  return {
    ...rest,
    data: {
      likes,
      isLiked,
      likeCount,
    },
  };
};

export const useUserComments = () => {
  return useQuery({
    queryKey: ["userComments"],
    queryFn: fetchUserComments,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useCommentLike = (commentId: number) => {
  const {
    mutate: toggleLike,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: (data) => {
      console.log("Toggle like success:", data);
    },
    onError: (error) => {
      console.error("Toggle like error:", error);
    },
  });

  const handleHeartClick = (likeCount: number) => {
    if (isLoading) return;

    // likeCount가 0보다 크면 이미 좋아요를 눌렀다고 가정
    const action = likeCount > 0 ? "dislike" : "like";
    toggleLike({ commentId, action });
  };

  return {
    handleHeartClick,
    isLoading,
    error,
  };
};
