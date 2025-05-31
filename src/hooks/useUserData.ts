import { useQuery, useQueryClient } from "@tanstack/react-query";
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
const toggleSummaryLike = async (summaryId: string) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/summaries/${summaryId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("좋아요 토글 실패");
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

export const useUserLikes = (summaryId?: string) => {
  const queryClient = useQueryClient();

  const { data: likes = [], ...rest } = useQuery({
    queryKey: ["userLikes"],
    queryFn: fetchUserLikes,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const toggleLike = async () => {
    if (!summaryId) return;

    try {
      await toggleSummaryLike(summaryId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["userLikes"] }),
        queryClient.invalidateQueries({ queryKey: ["summary", summaryId] }),
      ]);
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
      throw error;
    }
  };

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
    toggleLike,
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
