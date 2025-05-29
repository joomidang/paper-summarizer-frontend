import { useQuery } from "@tanstack/react-query";
import { getCookie } from "@/app/utils/getCookie";
import { apiUrl } from "@/app/(auth)/_components/Login";

const fetchUserInfo = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("사용자 정보 불러오기 실패");
  const result = await response.json();
  return result.data;
};

const fetchUserSummaries = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me/summaries`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("요약본 불러오기 실패");
  const result = await response.json();
  return result.data.content;
};

const fetchUserInterests = async () => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) throw new Error("No access token");

  const response = await fetch(`${apiUrl}/api/users/me/interests`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  if (!response.ok) throw new Error("관심사 불러오기 실패");
  const result = await response.json();
  return result.data.interests;
};

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: fetchUserInfo,
    enabled: !!getCookie("accessToken"),
  });
};

export const useUserSummaries = () => {
  return useQuery({
    queryKey: ["userSummaries"],
    queryFn: fetchUserSummaries,
    enabled: !!getCookie("accessToken"),
  });
};

export const useUserInterests = () => {
  return useQuery({
    queryKey: ["userInterests"],
    queryFn: fetchUserInterests,
    enabled: !!getCookie("accessToken"),
  });
};
