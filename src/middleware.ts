import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const userInfo = request.cookies.get("userInfo-storage");
    if (!userInfo || !isUserInfoComplete(userInfo.value)) {
      return NextResponse.redirect(new URL("/sign-up", request.url));
    }
  }

  return NextResponse.next();
}

function isUserInfoComplete(userInfoString: string) {
  try {
    const userInfo = JSON.parse(userInfoString);
    return userInfo.username && userInfo.profileImageUrl && userInfo.interests;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ["/"],
};
