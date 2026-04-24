import { register,login,getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setUser,setLoading,setError } from "../auth.slice";
import { useToast } from "../../ui/toast/useToast";

export function useAuth(){

    const dispatch = useDispatch();
    const { showToast } = useToast();

    const registerUser=async ({email,contact,password,fullname,isSeller})=>{
        dispatch(setLoading(true));
        try {
            const response = await register({email,contact,password,fullname,isSeller});
            dispatch(setUser(response.user));
            return response.user;
        } catch (error) {
            showToast({ message: error.response?.data?.message || "Failed to register", type: 'error' });
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
            return response.user;
        } catch (error) {
            showToast({ message: error.response?.data?.message || "Failed to login", type: 'error' });
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    const handleGetMe=async()=>{
        dispatch(setLoading(true));
        try {
            const response = await getMe();
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            throw error;
        }finally{
            dispatch(setLoading(false));
        }
    }

    return { registerUser,loginUser,handleGetMe };
}