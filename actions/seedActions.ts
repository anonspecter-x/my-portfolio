"use server";

import connectToDatabase from "../lib/mongodb";
import Project from "../models/Project";
import Skill from "../models/Skill";

export async function seedDatabase() {
  try {
    await connectToDatabase();

    // আগের কোনো ডেমো ডাটা থাকলে ডিলিট করে ক্লিন করে নিবে
    await Project.deleteMany({});
    await Skill.deleteMany({});

    // 🚀 ডেমো প্রজেক্ট ডাটা পুশ করা হচ্ছে
    await Project.insertMany([
      {
        title: "OmniStore - Digital E-Commerce",
        description: "A feature-rich, scalable e-commerce solution built with Next.js, featuring a complete shopping experience and Stripe integration.",
        imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop",
        liveLink: "https://omnistore.demo",
        githubLink: "https://github.com/your-repo",
        tags: ["Next.js", "TailwindCSS", "MongoDB", "Zustand"],
        isFeatured: true,
      },
      {
        title: "Tottho - Link-in-Bio Platform",
        description: "A high-performance, customizable link-sharing platform featuring dynamic themes, robust analytics, and a modern dashboard.",
        imageUrl: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1000&auto=format&fit=crop",
        liveLink: "https://tottho.demo",
        githubLink: "https://github.com/your-repo",
        tags: ["React", "Express.js", "Node.js"],
        isFeatured: true,
      }
    ]);

    // 🚀 ডেমো স্কিল ডাটা পুশ করা হচ্ছে
    await Skill.insertMany([
      {
        title: "Development",
        category: "Web",
        details: "Building responsive websites. Providing the users an enriching experience that responds to any device and screen size.",
        iconText: "Code2"
      },
      {
        title: "Database Admin",
        category: "Backend",
        details: "Designing robust NoSQL and Relational databases. Experienced in handling complex queries and data architecture.",
        iconText: "Database"
      }
    ]);

    return { success: true, message: "Database seeded successfully! 🎉" };
  } catch (error) {
    console.error("Seeding Error:", error);
    return { success: false, message: "Failed to seed database." };
  }
}