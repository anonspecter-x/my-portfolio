import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth; // সেশন আছে কি না চেক করছে
  const { pathname } = req.nextUrl;

  // ১. ইউজার যদি লগইন ছাড়া /dashboard এ যেতে চায়, তাকে /login এ পাঠাবে
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ২. ইউজার যদি অলরেডি লগইন করা থাকে এবং আবার /login এ যায়, তাকে সরাসরি ড্যাশবোর্ডে পাঠাবে
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

// কোন কোন রাউটে এই প্রক্সিটি কাজ করবে তার কনফিগারেশন
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|og-image.png).*)"],
};