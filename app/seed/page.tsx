"use client";

import { useState } from "react";
import { seedDatabase } from "../../actions/seedActions";

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMessage("Processing...");
    
    // Server Action কল করা হচ্ছে
    const result = await seedDatabase();
    
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-black px-4">
      <h1 className="text-3xl font-bold mb-6">Database Seeding Tools 🛠️</h1>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        Clicking the button below will securely connect to your MongoDB Atlas and push the demo Projects and Skills using Next.js Server Actions.
      </p>
      
      <button 
        onClick={handleSeed}
        disabled={loading}
        className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {loading ? "Injecting Data to MongoDB..." : "Push Demo Data"}
      </button>

      {message && (
        <div className={`mt-8 p-4 rounded-lg font-bold ${message.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
}