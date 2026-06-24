"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    // লগইন রিকোয়েস্ট পাঠানো হচ্ছে
    await signIn("credentials", formData, { redirectTo: "/dashboard" });
  } catch (error) {
    // যদি লগইন ফেইল করে, তবে এরর মেসেজ রিটার্ন করবে
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Email or Password!";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    // NEXT_REDIRECT এররটিকে অবশ্যই থ্রো করতে হবে, নইলে ড্যাশবোর্ডে যাবে না
    throw error;
  }
}