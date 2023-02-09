import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req: any) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone()

  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    url.pathname = '/login'
    return NextResponse.redirect(url);
  }
}

export const config = {
    matcher: ["/", "/library", "/liked-songs", "/playlist/(.*)"]
};
