import { ObjectId } from "mongodb";

export interface SettingsType {
  _id?: string | ObjectId;
  developerName: string;
  developerRole: string;
  developerEmail: string;
  developerPhone: string;
  developerRegion: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  developerPhoto?: string; // 📌 Cloudflare R2 image link for your photo
  siteLogo?: string;       // 📌 Cloudflare R2 image link for website logo
  updatedAt?: Date;
}