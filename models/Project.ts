import mongoose, { Schema, models } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }, // প্রজেক্টের ছবির লিংক
    liveLink: { type: String, required: false },
    githubLink: { type: String, required: false },
    tags: [{ type: String }], // যেমন: ["React", "Next.js", "MongoDB"]
    isFeatured: { type: Boolean, default: false }, // হোমপেজে দেখানোর জন্য
  },
  { timestamps: true } // এটি অটোমেটিক createdAt এবং updatedAt টাইম সেভ করবে
);

// Next.js এর হট-রিলোড ক্র্যাশ ঠেকাতে এই লাইনটি খুবই জরুরি
const Project = models.Project || mongoose.model("Project", projectSchema);

export default Project;