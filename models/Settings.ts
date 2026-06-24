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
  updatedAt?: Date;
}