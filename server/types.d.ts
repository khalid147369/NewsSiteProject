import 'express';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}
export interface IPost  {
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

