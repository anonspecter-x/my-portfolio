import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 📌 ১. MongoDB থেকে ইউজারের ইনফরমেশন ডায়নামিক্যালি তুলে আনা
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settings = await db.collection("settings").findOne({});
    const skills = await db.collection("skills").find({}).toArray();
    const projects = await db.collection("projects").find({}).toArray();
    
    await client.close();

    // 📌 ২. AI-কে ডাটা শেখানোর জন্য System Prompt তৈরি করা
    const developerName = settings?.developerName || "the developer";
    const developerRole = settings?.developerRole || "a Software Engineer";
    
    const skillsList = skills.map(s => `${s.name} (${s.percentage}%)`).join(", ");
    const projectsList = projects.map(p => `${p.title}: ${p.description}`).join(" | ");

    const systemPrompt = `
      You are the personal AI Assistant for ${developerName}, who is a ${developerRole}.
      Your job is to answer questions from visitors visiting this portfolio website.
      Be professional, friendly, and concise. Do not use complex markdown, use simple text.
      
      Here is the dynamic data about ${developerName} you must use to answer questions:
      - Location/Region: ${settings?.developerRegion || "Not specified"}
      - Email: ${settings?.developerEmail || "Use the contact form"}
      - Technical Skills: ${skillsList || "Not updated yet"}
      - Key Projects: ${projectsList || "Not updated yet"}

      If the user asks something you don't know from this data, politely say you don't have that specific information and request them to reach out via the contact page.
    `;

    // 📌 ৩. Gemini Model Call করা (System Prompt সহ)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // কনটেক্সট এবং ইউজারের মেসেজ মিলিয়ে প্রম্পট পাঠানো
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}\nAI Answer:`;
    
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
    
  } catch (error) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}