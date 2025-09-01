import React, { createContext, useContext, useState } from "react";
import { type IPost, type PostsType } from "../utils/types";
import { useGetWorldReducer } from "../reducer/pagesReducers/WorldPostsReducer";
import { useGetAllPostsReducer } from "../reducer/pagesReducers/AllPostsReducer";
import { useGetSportsReducer } from "../reducer/pagesReducers/SportsPostsReducer";
import { useGetPoliticsReducer } from "../reducer/pagesReducers/PoliticsPostsReducer";
import { useGetTechnologyReducer } from "../reducer/PanelReducers/TechnologyPostsReducer";

type FetchWithArea = (
  area: string,
  page?: number,
  direction?: number
) => Promise<void>;
type FetchWithoutArea = (page?: number, direction?: number) => Promise<void>;

type CategoryState<T extends (...args: any) => Promise<void>> = {
  data: PostsType;
  fetch: T;
};

type PostContextType = {
  categories: {
    all: CategoryState<FetchWithoutArea>;
    world: CategoryState<FetchWithArea>;
    sports: CategoryState<FetchWithArea>;
    politics: CategoryState<FetchWithArea>;
    technology: CategoryState<FetchWithArea>;
  };
  post: IPost | undefined;
  setPost: React.Dispatch<React.SetStateAction<IPost | undefined>>;
};

export const PostContext = createContext<PostContextType | undefined>(
  undefined
);

// Hook para consumir el contexto
export const usePostsContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostsContext must be used within PostProvider");
  }
  return context;
};

// Provider
export const PostProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Reducers por categoría
  const { fetchData, all } = useGetAllPostsReducer();
  const { fetchWorld, world } = useGetWorldReducer();
  const { fetchSports, sports } = useGetSportsReducer();
  const { fetchPolitics, politics } = useGetPoliticsReducer();
  const { fetchTechnology, technology } = useGetTechnologyReducer();

  const [post, setPost] = useState<IPost>();

  const value: PostContextType = {
    categories: {
      all: {
        data: all,
        fetch: fetchData,
      },
      world: {
        data: world,
        fetch: fetchWorld,
      },
      sports: {
        data: sports,
        fetch: fetchSports,
      },
      politics: {
        data: politics,
        fetch: fetchPolitics,
      },
      technology: {
        data: technology,
        fetch: fetchTechnology,
      },
    },
    post,
    setPost,
  };
  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
