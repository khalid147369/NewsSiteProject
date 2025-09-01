import { useReducer } from "react";
import type { PostsType } from "../../utils/types";
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

export function useGetWorldReducer(
  
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
          posts:
            state.page === 1
              ? action.payload.posts
              : [...state.posts, ...action.payload.posts],
          total: action.payload.total,
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          loading: false,
          error: null,
          direction: action.payload.direction || -1,
        };
      case "FETCH_ERROR":
        return { ...state, loading: false, error: action.payload };

      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
  const [state, dispatch] = useReducer(reducer, initialPosts);

  const fetchWorld = async (
    area: string,
    page: number = 1,
    direction: number = -1
  ) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getAreaPosts(area, page, direction);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  };

  return {
    world: state,
    fetchWorld,
  };
}


