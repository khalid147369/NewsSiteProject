import { publicDecrypt } from 'crypto';
import mongoose, { Schema, Document } from 'mongoose';
// import { IPost } from '../types';

export interface IPost extends Document {
  title: string;
  content: string;
  description: string;
  publishedAt: Date;
  category: string;
  image?: string;
  source: {
    name: string;
    url: string;
            }
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content:    { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  source: {
    name: { type: String, required: true },
    url: { type: String, required: true }
  },
  publishedAt: { type: Date, default: Date.now }
});
PostSchema.index({ title: "text", content: "text" });
export default mongoose.model<IPost>('post', PostSchema);