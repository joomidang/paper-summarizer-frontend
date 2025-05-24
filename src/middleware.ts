import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // "/" 경로에 접근할 때만 체크
  if (request.nextUrl.pathname === "/") {
    // 쿠키나 헤더에서 사용자 정보 확인
    const userInfo = request.cookies.get("userInfo");

    // userStore 정보가 없거나 불완전한 경우
    if (!userInfo || !isUserInfoComplete(userInfo.value)) {
      return NextResponse.redirect(new URL("/sign-up", request.url));
    }
  }

  return NextResponse.next();
}

function isUserInfoComplete(userInfoString: string) {
  try {
    const userInfo = JSON.parse(userInfoString);
    // 필요한 필드들이 모두 있는지 체크
    return userInfo.name && userInfo.email && userInfo.additionalField;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/"],
};
