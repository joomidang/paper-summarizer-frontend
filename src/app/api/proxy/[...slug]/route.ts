// app/api/proxy/[...slug]/route.ts
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  "http://ec2-43-202-9-100.ap-northeast-2.compute.amazonaws.com:8080";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    console.log("Proxying GET request to:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type":
          request.headers.get("Content-Type") || "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    console.log("Proxying POST request to:", backendUrl);

    const body = await request.text();

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type":
          request.headers.get("Content-Type") || "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("Proxy POST error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    const body = await request.text();

    const response = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type":
          request.headers.get("Content-Type") || "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy PUT error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    const body = await request.text();

    const response = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type":
          request.headers.get("Content-Type") || "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
      body: body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy PATCH error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const apiPath = url.pathname.replace("/api/proxy", "");
    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    const response = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
        "Content-Type":
          request.headers.get("Content-Type") || "application/json",
        Cookie: request.headers.get("Cookie") || "",
      },
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy DELETE error:", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

// CORS preflight 요청 처리
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// 기존 Login.tsx에서 apiUrl 변경
// export const apiUrl = process.env.NODE_ENV === 'production'
//   ? '/api/proxy'  // 프로덕션에서는 프록시 사용
//   : 'http://localhost:8080';  // 개발환경에서는 직접 호출
