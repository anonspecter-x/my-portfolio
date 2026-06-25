import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export const dynamic = 'force-dynamic';

// 📌 চ্যাট ওপেন হলে প্রথম ডায়নামিক ওয়েলকাম মেসেজ (সালাম সহ)
export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    const settings = await db.collection("settings").findOne({});
    await client.close();

    const devName = settings?.developerName || "the developer";
    
    // 📌 "for" বাদ দিয়ে "'s AI Assistant" দেওয়া হয়েছে
    const greeting = `Assalamualaikum! 👋 I am **Syntaxi**, ${devName}'s AI Assistant. \n\nYou can ask me about his [Projects](/projects), [Skills](/about), [Blog Posts](/blog), or how to [Contact](/contact) him. How can I help you today?`;

    return NextResponse.json({ greeting });
  } catch (error) {
    return NextResponse.json({ greeting: "Assalamualaikum! 👋 I am Syntaxi, the AI Assistant here. How can I help you explore this portfolio today?" });
  }
}

// 📌 ইউজারের মেসেজের রিপ্লাই দেওয়ার জন্য POST মেথড
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db();
    
    const settings = await db.collection("settings").findOne({});
    const skills = await db.collection("skills").find({}).toArray();
    const projects = await db.collection("projects").find({}).toArray();
    const posts = await db.collection("posts").find({}).toArray().catch(() => []); 
    
    await client.close();

    const devName = settings?.developerName || "The Developer";
    
    // 📌 এআইকে ডেটা এবং লিংক দেওয়ার নিয়মকানুন
    const systemPrompt = `
      You are 'Syntaxi', a highly advanced, professional, and helpful AI assistant for ${devName}'s personal portfolio website.
      Always reply in strict, professional English. Never use Bengali or any other language.

      [WEBSITE STRUCTURE & INTERNAL LINKS]
      If a user asks for specific sections, provide these EXACT markdown links:
      - About / Skills: [About Page](/about)
      - Projects / Portfolio: [Projects Page](/projects)
      - Blog / Articles: [Blog Page](/blog)
      - Contact: [Contact Page](/contact)

      [DEVELOPER IDENTITY & CONTACT]
      - Name: ${devName}
      - Role: ${settings?.developerRole || "Software Professional"}
      - Email: ${settings?.developerEmail ? `[${settings.developerEmail}](mailto:${settings.developerEmail})` : "Not provided"}
      - Phone: ${settings?.developerPhone || "Not provided"}
      
      [SOCIAL MEDIA LINKS]
      - GitHub: ${settings?.social_github ? `[GitHub Profile](${settings.social_github})` : "N/A"}
      - LinkedIn: ${settings?.social_linkedin ? `[LinkedIn Profile](${settings.social_linkedin})` : "N/A"}
      - Twitter: ${settings?.social_twitter ? `[Twitter Profile](${settings.social_twitter})` : "N/A"}
      - WhatsApp: ${settings?.social_whatsapp ? `[WhatsApp](${settings.social_whatsapp})` : "N/A"}

      [PROJECTS (Provide live/github links if asked)]
      ${projects.map(p => `- **${p.title}**: ${p.description} (Link: ${p.liveLink ? `[Live Preview](${p.liveLink})` : (p.githubLink ? `[GitHub](${p.githubLink})` : `[View Project](/projects)`)})`).join("\n") || "No projects listed."}

      [BLOG ARTICLES]
      ${posts.map(b => `- **${b.title}**: [Read Article](/blog/${b.slug})`).join("\n") || "No articles published yet."}

      [RULES FOR FORMATTING - STRICT]
      1. Use bullet points for listing multiple projects, blogs, or social links.
      2. ALWAYS format URLs using Markdown format: [Link Text](URL). Example: [GitHub](https://github.com/...)
      3. Use **bold** text to emphasize key terms or project names.
      4. Be concise but rich in information. Don't write huge paragraphs; use structured lists.
      5. Do not hallucinate or invent information not provided in this prompt.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}\nSyntaxi Response:`;
    
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
    
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}