"use client";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { apiUrl } from "@/app/(auth)/_components/Login";
import { useFileStore } from "@/store/fileStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getCookie } from "@/app/utils/getCookie";
import ProgressSteps from "./ProgressSteps";

interface PaperEventData {
  summaryId?: string;
  //[key: string]: any;
}

const PaperAnalyze = () => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>(
    "논문의 표와 그림을 추출하여 시작하고 있습니다..."
  );
  const [, setIsError] = useState<boolean>(false);
  const [, setIsLoading] = useState<boolean>(false);
  const { paperId } = useFileStore();
  const hasRequestedRef = useRef<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { setSummaryId } = useFileStore();

  // SSE 이벤트 구독
  const subscribeToEvents = (paperId: string) => {
    // 기존 연결이 있다면 종료
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const eventUrl = `${apiUrl}/api/papers/${paperId}/events?access_token=${getCookie(
      "accessToken"
    )}`;
    console.log("SSE 연결 시도:", eventUrl);

    const eventSource = new EventSource(eventUrl);
    eventSourceRef.current = eventSource;

    // 모든 메시지 수신 확인 (디버깅)
    eventSource.onmessage = (event) => {
      console.log("수신된 SSE 메시지:", event);
      // console.log("메시지 타입:", event.type);
      // console.log("메시지 데이터:", event.data);
    };

    // 연결 성공 이벤트
    eventSource.addEventListener("connect", (event) => {
      console.log("SSE 연결 성공:", event.data);
      setStatusText("실시간 업데이트 연결이 성공했습니다.");
      setIsError(false);
    });

    // 파싱 시작 이벤트
    eventSource.addEventListener("parsing_started", (event) => {
      console.log("파싱 시작 이벤트:", event.data);
      setStatusText("논문 파싱이 시작되었습니다...");
      setProgress(40);
    });

    // 파싱 완료 이벤트
    eventSource.addEventListener("parsing_completed", (event) => {
      console.log("RAW 파싱 완료 이벤트:", event);
      console.log("파싱 완료 event type:", event.type);
      console.log("파싱 완료 event data:", event.data);

      try {
        const data: PaperEventData = JSON.parse(event.data);
        console.log("논문 파싱 완료:", data);
        setStatusText("파싱이 완료되었습니다. 요약 생성 중...");
        setProgress(80);
        toast.info("논문 파싱이 완료되었습니다");
      } catch (error) {
        console.error("파싱 이벤트 데이터 파싱 오류:", error);
        console.error("원본 데이터:", event.data);
      }
    });

    // 요약 시작 이벤트
    eventSource.addEventListener("summary_started", (event) => {
      console.log("요약 시작 이벤트:", event.data);
      setStatusText("요약 생성이 시작되었습니다...");
      setProgress(85);
    });

    // 요약 완료 이벤트
    eventSource.addEventListener("summary_completed", (event) => {
      console.log("RAW 요약 완료 이벤트:", event);
      console.log("요약 완료 event type:", event.type);
      console.log("요약 완료 event data:", event.data);

      try {
        const data: PaperEventData = JSON.parse(event.data);
        console.log("요약 생성 완료:", data);
        setStatusText("요약이 완료되었습니다. 편집 페이지로 이동합니다...");
        setProgress(100);

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }

        toast.success("분석이 완료되었습니다");

        setTimeout(() => {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }

          if (data.summaryId) {
            setSummaryId(+data.summaryId);
            router.push(`/papers/upload/edit/${data.summaryId}`);
          } else {
            router.push(`/papers/upload/edit/${data.summaryId}`);
          }
        }, 2000);
      } catch (error) {
        console.error("요약 이벤트 데이터 파싱 오류:", error);
        console.error("원본 데이터:", event.data);
        setStatusText("요약 데이터 처리 중 오류가 발생했습니다.");
        setIsError(true);
        toast.error("요약 데이터 처리 중 오류가 발생했습니다");
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      console.error("EventSource readyState:", eventSource.readyState);
      setIsError(true);
      setStatusText("실시간 업데이트 연결이 끊어졌습니다.");
      //toast.error("연결이 끊어졌습니다");
      eventSource.close();
    };

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 75) return prev + 1;
        return prev;
      });
    }, 200);

    return eventSource;
  };

  const handleAnalyzeAndSubscribe = async (paperId: string) => {
    setIsLoading(true);
    setProgress(0);
    setIsError(false);

    try {
      const response = await fetch(`${apiUrl}/api/papers/${paperId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("accessToken")}`,
        },
        body: JSON.stringify({
          prompt: "분석에 필요한 프롬프트",
          language: "ko",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `분석 요청 실패: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("분석 요청 성공:", data);

      // SSE 이벤트 구독 시작
      subscribeToEvents(paperId);
    } catch (error) {
      console.error("분석 중 오류 발생:", error);
      toast.error("분석 요청 중 오류가 발생했습니다");
      setIsError(true);
      setStatusText("분석 요청 중 오류가 발생했습니다.");

      // 진행률 애니메이션 정지
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(0);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // 연결 재시도
  // const retryConnection = () => {
  //   if (eventSourceRef.current) {
  //     eventSourceRef.current.close();
  //     eventSourceRef.current = null;
  //   }

  //   if (progressIntervalRef.current) {
  //     clearInterval(progressIntervalRef.current);
  //     progressIntervalRef.current = null;
  //   }

  //   setProgress(0);
  //   setIsError(false);
  //   setStatusText("다시 연결 중...");

  //   handleAnalyzeAndSubscribe(paperId.toString());
  // };

  useEffect(() => {
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    console.log("Analyzing with paperId:", paperId);
    handleAnalyzeAndSubscribe(paperId.toString());

    return () => {
      console.log("Component unmounting");

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
    //eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto">
      <ProgressSteps progress={progress} statusText={statusText} />
      <ProgressBar progress={progress} text={statusText} />
      {/* {isError && (
        <div className="mt-6 text-center">
          <button
            onClick={retryConnection}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            다시 시도
          </button>
        </div>
      )} */}
    </div>
  );
};

export default PaperAnalyze;
