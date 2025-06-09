import { apiUrl } from "@/app/contexts/AuthContext";
import { getCookie } from "@/app/utils/getCookie";
import { useQuery } from "@tanstack/react-query";

interface Tag {
  count: number;
  name: string;
}

const fetchPopularTags = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/tags/popular`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("태그 불러오기 실패");
  const result = await response.json();
  return result.data || [];
};

const fetchPopularSummaries = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/summaries/popular`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("요약본 불러오기 실패");
  const result = await response.json();
  console.log(result);
  return result.data?.summaries || [];
};

const fetchRecommendedSummaries = async (summaryId: string) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(
    `${apiUrl}/api/summaries/${summaryId}/recommand`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("요약본 불러오기 실패");
  const result = await response.json();
  return result.data?.content || [];
};

const fetchSearchSummaries = async (keyword: string) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(
    `${apiUrl}/api/summaries/search?keyword=${keyword}&page=0&size=20`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("검색 결과 불러오기 실패");
  const result = await response.json();
  return result.data?.summaries || [];
};

const fetchTagSummaries = async (tagName: string) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(
    `${apiUrl}/api/summaries/tag?tagName=${tagName}&page=0&size=20`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    }
  );

  if (!response.ok) throw new Error("태그 요약본 불러오기 실패");
  const result = await response.json();
  return result.data?.summaries || [];
};

export const useTagSummaries = (tagName: string) => {
  return useQuery({
    queryKey: ["tagSummaries", tagName],
    queryFn: () => fetchTagSummaries(tagName),
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePopularTags = () => {
  return useQuery<Tag[]>({
    queryKey: ["popularTags"],
    queryFn: fetchPopularTags,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useSearchSummaries = (keyword: string) => {
  return useQuery({
    queryKey: ["searchSummaries", keyword],
    queryFn: () => fetchSearchSummaries(keyword),
    enabled: false, // 수동으로만 실행
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePopularSummaries = () => {
  return useQuery({
    queryKey: ["popularSummaries"],
    queryFn: fetchPopularSummaries,
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useRecommendedSummaries = (summaryId: string) => {
  return useQuery({
    queryKey: ["recommendedSummaries", summaryId],
    queryFn: () => fetchRecommendedSummaries(summaryId),
    enabled: typeof window !== "undefined" && !!getCookie("accessToken"),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
