import { apiUrl } from "@/app/contexts/AuthContext";
import { getCookie } from "@/app/utils/getCookie";
import { useQuery } from "@tanstack/react-query";

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
