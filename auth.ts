import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        // ইমেইল এবং পাসওয়ার্ড চেক করা হচ্ছে
        if (credentials?.email === adminEmail && credentials?.password === adminPassword) {
          // সফল হলে অবশ্যই একটি অবজেক্ট রিটার্ন করতে হবে, নইলে সেশন তৈরি হবে না
          return { id: "1", name: "Admin", email: credentials.email as string };
        }
        
        // ভুল হলে null রিটার্ন করবে, যা AuthError থ্রো করবে
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // আমাদের কাস্টম লগইন পেজ
  },
  session: {
    strategy: "jwt", // Credentials এর জন্য JWT বাধ্যতামূলক
  },
  secret: process.env.AUTH_SECRET,
});