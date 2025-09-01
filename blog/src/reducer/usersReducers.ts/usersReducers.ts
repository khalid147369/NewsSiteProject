import { useReducer } from "react";
import type { IPost, PostsType } from "../utils/types";
import type { IUser } from "../../utils/types";
import { login } from "../../api/user";
import { getUsers } from "../../api/admin";


type User ={

        _id?:string,
  email:'',
roles: 'user',
username:'',


}
type Users = {



users : User[],


loading:boolean,
error:string  


};
const initialUsers:Users = {



users :[] as User[],


loading:false,
error:""  


};

type Action =
//   | { type: "SET_POSTS"; payload: IPost[] }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: User[] }
  | { type: "FETCH_ERROR"; payload: string };

export   function useGetAllusersReducer( ){
    function reducer(state:Users, action: Action): Users {
        switch (action.type) {
       
    case "FETCH_START":
      return { ...state, loading: true, error: '' };
  case "FETCH_SUCCESS":

    return {
      ...state,
      users: action.payload,
      loading: false,
      error: ''
    };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
    }
  const [state, dispatch] = useReducer(reducer, initialUsers);

 const getusers = async (token:string) => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getUsers(token);
      dispatch({ type: "FETCH_SUCCESS", payload: data });
      
      return data
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
      return 0
    }
  };


  
return {
    users:state,
    getusers
    
  };
    }






