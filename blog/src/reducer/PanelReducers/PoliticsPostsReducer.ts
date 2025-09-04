import { useReducer } from "react";
// Update the import path if the types file is located elsewhere, for example:
import type { PostsType } from "../../utils/types";
// Or create the file at '../utils/types.ts' and export PostsType if it doesn't exist.
import { getAreaPosts } from "../../api/posts";

const initialPosts: PostsType = {
  posts: [],
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
  direction: -1,
};

type Action =
  | { type: "SET_ALL_POSTS"; payload: PostsType }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: PostsType }
  | { type: "FETCH_ERROR"; payload: string };

export function useGetPoliticsReducer(
) {
  function reducer(state: PostsType, action: Action): PostsType {
    switch (action.type) {
      case "SET_ALL_POSTS":
        return { ...state, ...action.payload };
      case "FETCH_START":
        return { ...state, loading: true, error: null };
      case "FETCH_SUCCESS":
        return {
          ...state,
          posts: action.payload.posts,
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          loading: false,
          error: null,
          direction: action.payload.direction || -1,
        };
      case "FETCH_ERROR":
        return { ...state, loading: false, error: action.payload };

       default: {
        // Exhaustiveness check
        const _exhaustiveCheck: never = action;
        throw new Error(`Unhandled action type: ${(_exhaustiveCheck as any).type}`);
      }
    }
  }
  const [state, dispatch] = useReducer(reducer, initialPosts);

  const fetchPolitics = async (
    area: string,
    page: number = 1,
    direction: number = -1
  ) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getAreaPosts(area, page, direction);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      const errorMessage = (err instanceof Error && err.message) ? err.message : "An unknown error occurred";
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
    }
  };

  return {
    politics: state,
    fetchPolitics,
  };
}
