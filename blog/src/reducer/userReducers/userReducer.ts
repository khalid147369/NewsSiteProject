import { useReducer } from "react";
import type { IUser } from "../../utils/types";
import { login } from "../../api/user";



const initialPosts: IUser = {

accessToken:'',
message:'',
user:{
  email:'',
role: 'user',
username:'',
},
loading:false,
error:""  


};

type Action =
//   | { type: "SET_POSTS"; payload: IPost[] }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: IUser }
  | { type: "FETCH_ERROR"; payload: string };

export   function useGetAlluserReducer( ){
    function reducer(state: IUser, action: Action): IUser {
        switch (action.type) {
    // case "SET_POSTS":
       
    case "FETCH_START":
      return { ...state, loading: true, error: '' };
    case "FETCH_SUCCESS":

      return {
    ...state,accessToken:action.payload.accessToken,user:action.payload.user,message:action.payload.message
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

 const logIn = async (email: string, password: string) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await login(email,password);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      
      return data
    } catch (err) {
      const errorMessage = (err instanceof Error && err.message) ? err.message : "An unknown error occurred";
      dispatch({ type: "FETCH_ERROR", payload: errorMessage });
      return 0
    }
  };


  
return {
    user:state,
    logIn
    
  };
    }






