import { MongoClient } from "mongodb";
import { deleteMessage } from "./actions";
import { Trash2, Mail, Calendar, User } from "lucide-react";

// ডাটাবেজ থেকে মেসেজ আনার ফাংশন
async function getMessages() {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db();
  // নতুন মেসেজগুলো সবার উপরে দেখানোর জন্য sort করা হয়েছে
  const messages = await db.collection("messages").find().sort({ createdAt: -1 }).toArray();
  await client.close();
  
  return messages.map((m) => ({ ...m, _id: m._id.toString() }));
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* 📌 Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">
          Client Inbox
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Read and manage messages sent from your portfolio contact form.
        </p>
      </div>

      {/* 📌 Messages List */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-[#111]/50">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Mail className="w-4 h-4" /> All Messages ({messages.length})
          </h2>
        </div>

        {messages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-gray-50 dark:bg-[#111] rounded-full flex items-center justify-center text-gray-400">
              <Mail className="w-8 h-8" />
            </div>
            <p className="text-gray-500 font-medium">Inbox is empty. No new messages.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {messages.map((msg) => (
              <div key={msg._id} className="p-6 hover:bg-gray-50 dark:hover:bg-[#111] transition-colors group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  
                  {/* Sender Info & Message */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                        <User className="w-4 h-4 text-gray-400" /> {msg.name}
                      </div>
                      <a href={`mailto:${msg.email}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                        {msg.email}
                      </a>
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" /> 
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : "Just now"}
                      </div>
                    </div>

                    <div className="bg-gray-100/50 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="shrink-0">
                    <form action={async () => {
                      "use server";
                      await deleteMessage(msg._id);
                    }}>
                      <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-500 text-xs font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-100 dark:border-red-900/50 opacity-100 md:opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}