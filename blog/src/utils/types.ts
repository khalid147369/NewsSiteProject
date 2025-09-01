export interface IPost {
  _id: string;
  title: string;
  content: string;
  description: string;
  publishedAt: Date;
  category: string;
  image?: string;
  source: {
    name: string;
    url: string;
  };
}

export type PostsType = {
  posts: IPost[];
  total: number;
  page: number;
  totalPages: number;
  loading?: boolean;
  error?: string | null;
  direction?: number;
  totalCategory?: {
    politics: number;
    sports: number;
    world: number;
    technology: number;
  };
};
export interface IUser {
  accessToken?: string;
  message?: string;
  user: {
    email: string;
    role: "admin" | "user" | null;
    username: string;
  };

  loading?: boolean;
  error?: string;
}
