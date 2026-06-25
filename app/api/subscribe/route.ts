import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let email: string | null = null;

    // ফর্ম ডেটা নাকি JSON রিকোয়েস্ট চেক করা হচ্ছে
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await req.json();
      email = body.email;
    } else {
      const formData = await req.formData();
      email = formData.get("email") as string;
    }

    // ইমেইল ভ্যালিডেশন
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    // Environment Variables চেক করা হচ্ছে
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const DATACENTER = process.env.MAILCHIMP_API_SERVER;

    if (!API_KEY || !AUDIENCE_ID || !DATACENTER) {
      return NextResponse.json({ error: "Mailchimp API credentials are not set." }, { status: 500 });
    }

    // Mailchimp API-তে ডেটা পাঠানো
    const data = {
      email_address: email,
      status: "subscribed",
    };

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const responseData = await response.json();

    if (response.status >= 400) {
      // ইউজার যদি আগে থেকেই সাবস্ক্রাইব করা থাকে
      if (responseData.title === "Member Exists") {
        return NextResponse.json({ message: "You are already subscribed!" }, { status: 200 });
      }
      return NextResponse.json({ error: responseData.detail || "Error subscribing to newsletter." }, { status: 400 });
    }

    // সফলভাবে সাবস্ক্রাইব হলে রেসপন্স
    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}