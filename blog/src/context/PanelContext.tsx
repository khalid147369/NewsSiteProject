import React, { createContext, useContext, useState } from "react";
import { type IPost, type PostsType } from "../utils/types";
import { useGetWorldReducer } from "../reducer/PanelReducers/WorldPostsReducer";
import { useGetAllPostsReducer } from "../reducer/PanelReducers/AllPostsReducer";
import { useGetSportsReducer } from "../reducer/PanelReducers/SportsPostsReducer";
import { useGetPoliticsReducer } from "../reducer/PanelReducers/PoliticsPostsReducer";
import { getPosts, getAreaPosts } from "../api/posts";
import { useGetTechnologyReducer } from "../reducer/PanelReducers/TechnologyPostsReducer";
import { useGetAllusersReducer } from "../reducer/usersReducers.ts/usersReducers";

type FetchWithArea = (area: string, page?: number, direction?: number) => Promise<void>;
type FetchWithoutArea = (page?: number, direction?: number) => Promise<void>;
type CategoryKey = "all" | "world" | "sports" | "politics";
type CategoryState<T extends (...args: any) => Promise<void>> = {
  data: PostsType;
  fetch: T;
  update:( data: IPost[]) => void
};

type PostContextType = {
  categories: {
    all: CategoryState<FetchWithoutArea>;
    world: CategoryState<FetchWithArea>;
    sports: CategoryState<FetchWithArea>;
    politics: CategoryState<FetchWithArea>;
    technology: CategoryState<FetchWithArea>;
  };
  users:{
    data: any;
    fetch: (token:string) => Promise<void>;
    update:( data: IPost[]) => void
  };
  post: IPost | undefined;
  setPost: React.Dispatch<React.SetStateAction<IPost | undefined>>;
  currentCategory: CategoryKey ;
  setCurrentCategory: React.Dispatch<React.SetStateAction<CategoryKey >>;
};

export const PostContext = createContext<PostContextType | undefined>(undefined);

// Hook para consumir el contexto
export const usePostsContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostsContext must be used within PostProvider");
  }
  return context;
};
// Provider
export const PostsAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Reducers por categoría
  const { fetchData, all ,updatePosts  } = useGetAllPostsReducer(getPosts);
  const { fetchWorld, world } = useGetWorldReducer();
  const { fetchSports, sports } = useGetSportsReducer();
  const { fetchPolitics, politics } = useGetPoliticsReducer();
  const { fetchTechnology, technology } = useGetTechnologyReducer();
const {getusers,users} = useGetAllusersReducer();
  const [post, setPost] = useState<IPost>();
  const [currentCategory, setCurrentCategory] = useState<string | undefined>();

  const value: PostContextType = {
    categories: {
      all: { 
        data: all,          //  if you wont add here edit CategoryState first !!
        fetch: fetchData,
        update:updatePosts
      },
      world: { 
        data: world, 
        fetch: fetchWorld,
        update:updatePosts
      },
      sports: { 
        data: sports, 
        fetch: fetchSports ,
        update:updatePosts

      },
      politics: { 
        data: politics, 
        fetch: fetchPolitics ,
        update:updatePosts

      },
       technology: { 
        data: technology, 
        fetch: fetchTechnology ,
        update:updatePosts

      }
    },
    post,
    setPost,
    users:{
      data: users,
      fetch: (token:string) => getusers(token),
      update:()=>{}
    },
    currentCategory,
    setCurrentCategory,
  };
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
