// app/api/auth/github/callback/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  "http://ec2-43-202-9-100.ap-northeast-2.compute.amazonaws.com:8080";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    console.log("=== GitHub Callback API Route ===");
    console.log("Received code:", code);
    console.log("Request URL:", request.url);
    console.log(
      "Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    if (!code) {
      console.log("❌ No authorization code provided");
      return NextResponse.json(
        {
          error: "No authorization code provided",
        },
        { status: 400 }
      );
    }

    // 백엔드 GitHub 콜백 API 호출
    const backendUrl = `${BACKEND_URL}/api/auth/github/callback?code=${code}`;
    console.log("🔗 Calling backend:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Vercel-Frontend-Proxy/1.0",
        Accept: "application/json",
      },
      // 🔥 리다이렉트 수동 처리 (중요!)
      redirect: "manual",
    });

    console.log("📡 Backend response status:", response.status);
    console.log(
      "📡 Backend response headers:",
      Object.fromEntries(response.headers.entries())
    );

    // 백엔드 응답 처리
    if (response.status >= 200 && response.status < 400) {
      console.log("✅ Authentication successful");

      // 쿠키 헤더 추출
      const allCookies = [];

      // 최신 방식
      if (response.headers.getSetCookie) {
        const cookies = response.headers.getSetCookie();
        allCookies.push(...cookies);
        console.log("🍪 Cookies (new method):", cookies);
      }

      // 기존 방식
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        allCookies.push(setCookieHeader);
        console.log("🍪 Cookies (old method):", setCookieHeader);
      }

      // 성공 응답 생성 (JSON 형태로 반환, 리다이렉트 X)
      const successResponse = NextResponse.json(
        {
          success: true,
          message: "GitHub authentication successful",
          timestamp: new Date().toISOString(),
        },
        {
          status: 200,
        }
      );

      // 쿠키 설정
      allCookies.forEach((cookie, index) => {
        if (cookie && cookie.trim()) {
          console.log(`🍪 Setting cookie ${index + 1}:`, cookie);
          successResponse.headers.append("Set-Cookie", cookie);
        }
      });

      // CORS 헤더 설정
      successResponse.headers.set(
        "Access-Control-Allow-Origin",
        request.headers.get("origin") || "*"
      );
      successResponse.headers.set("Access-Control-Allow-Credentials", "true");
      successResponse.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS"
      );
      successResponse.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );

      console.log("✅ Sending success response");
      return successResponse;
    } else {
      // 백엔드 인증 실패
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        console.error("Error reading error response:", e);
        errorText = "Unable to read error response";
      }

      console.log(
        "❌ Backend authentication failed:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error: "GitHub authentication failed",
          status: response.status,
          details: errorText,
        },
        {
          status: response.status,
        }
      );
    }
  } catch (error) {
    console.error("💥 GitHub callback API error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      }
    );
  }
}

// OPTIONS 메서드 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  console.log("🔧 CORS preflight request received");

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}
