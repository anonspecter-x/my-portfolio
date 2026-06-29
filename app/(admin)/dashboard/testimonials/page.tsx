import { MongoClient } from "mongodb";
import { MessageSquareQuote } from "lucide-react";
import TestimonialManager, { TestimonialType } from "./TestimonialManager";

async function getTestimonials(): Promise<TestimonialType[]> {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  
  // 📌 Priority অনুযায়ী (বড় সংখ্যা আগে) এবং তারপর Date অনুযায়ী সর্ট করা
  const testimonials = await db.collection("testimonials")
    .find({})
    .sort({ priority: -1, createdAt: -1 })
    .toArray();
  
  await client.close();
  
  // 📌 approved ফিল্ড ম্যাপ করা হলো
  return testimonials.map((t) => ({ 
    _id: t._id.toString(),
    name: t.name,
    role: t.role,
    review: t.review,
    rating: t.rating,
    priority: t.priority || 0,
    photoUrl: t.photoUrl || "",
    approved: t.approved !== false // ডেটাবেজে approved না থাকলে ডিফল্ট true হিসেবে ধরবে
  })) as TestimonialType[];
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-12 max-w-5xl pb-16">
      {/* 📌 Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white flex items-center gap-3">
          <MessageSquareQuote className="w-8 h-8 text-blue-500" /> Client Testimonials
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">
          Manage client reviews, approve pending feedback, assign display priorities, and upload client photos dynamically.
        </p>
      </div>

      {/* 📌 Client Component for UI Management */}
      <TestimonialManager testimonials={testimonials} />
    </div>
  );
}