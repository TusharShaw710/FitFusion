import { register,login } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setUser,setLoading,setError } from "../auth.slice";

export function useAuth(){

    const dispatch = useDispatch();

    const registerUser=async ({email,contact,password,fullname,isSeller})=>{
        dispatch(setLoading(true));
        try {
            const response = await register({email,contact,password,fullname,isSeller});
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    const loginUser=async({identifier,password})=>{
        dispatch(setLoading(true));
        try {
            const response = await login({identifier,password});
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    return { registerUser,loginUser };
}