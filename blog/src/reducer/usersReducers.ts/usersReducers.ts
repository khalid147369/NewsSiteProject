import { useReducer } from "react";
import { getUsers } from "../../api/admin";

type User = {
  _id?: string;
  email: "";
  roles: "user";
  username: "";
};
type Users = {
  users: User[];

  loading: boolean;
  error: string;
};
const initialUsers: Users = {
  users: [] as User[],

  loading: false,
  error: "",
};

type Action =
  //   | { type: "SET_POSTS"; payload: IPost[] }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: User[] }
  | { type: "FETCH_ERROR"; payload: string };

export function useGetAllusersReducer() {
  function reducer(state: Users, action: Action): Users {
    switch (action.type) {
      case "FETCH_START":
        return { ...state, loading: true, error: "" };
      case "FETCH_SUCCESS":
        return {
          ...state,
          users: action.payload,
          loading: false,
          error: "",
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
  const [state, dispatch] = useReducer(reducer, initialUsers);

  const getusers = async (token: string) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getUsers(token);
      dispatch({ type: "FETCH_SUCCESS", payload: data });

      return data;
    } catch (err) {
      const errorMessage = (err as { message: string }).message;
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
      return 0;
    }
  };

  return {
    users: state,
    getusers,
  };
}
