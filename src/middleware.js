import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Các route không cần xác thực
  publicRoutes: [
    "/sign-in",
    "/sign-up",
    "/api/webhook/clerk"
    // Lưu ý: không thêm API liveblock vào đây
  ],
  afterSignOutUrl: "/trang-chu",

  afterAuth(auth, req, evt) {
    const path = req.nextUrl.pathname;

    // Kiểm tra đặc biệt cho API liveblock
    if (path.startsWith('/api/liveblock/auth')) {
      // Nếu không đăng nhập, trả về lỗi 401 Unauthorized
      if (!auth.userId) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
    }

    // Nếu người dùng chưa đăng nhập và không ở public route
    if (!auth.userId && !auth.isPublicRoute) {
      // Lưu URL hiện tại để redirect sau khi đăng nhập
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", path);
      return NextResponse.redirect(signInUrl);
    }

    // Nếu đã đăng nhập và cố truy cập trang sign-in hoặc sign-up
    if (auth.userId && ["/sign-in", "/sign-up"].includes(path)) {
      // Chuyển hướng về trang chủ
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl);
    }

    // Cho phép tiếp tục với các trường hợp còn lại
    return NextResponse.next();
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // match all paths
    "/", // match root
    "/(api|trpc)(.*)", // match API routes
  ],
};
