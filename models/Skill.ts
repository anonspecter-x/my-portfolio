import mongoose, { Schema, models } from "mongoose";

const skillSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // যেমন: "Development", "Design"
    details: { type: String, required: true },
    iconText: { type: String, required: false }, // আমরা চাইলে আইকনের নাম সেভ রাখতে পারি
  },
  { timestamps: true }
);

const Skill = models.Skill || mongoose.model("Skill", skillSchema);

export default Skill;