import mongoose, { Schema, models } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // অ্যাডমিন মেসেজটি পড়েছে কি না
  },
  { timestamps: true }
);

const Message = models.Message || mongoose.model("Message", messageSchema);

export default Message;