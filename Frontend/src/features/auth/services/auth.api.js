import axios from "axios";

const authApiInstance=axios.create({
    baseURL: "/api/auth",
    withCredentials: true
});


export async function register({email,contact,password,fullname,isSeller}){
    try {
        const response = await authApiInstance.post("/register",{
            email,
            contact,
            password,
            fullname,
            isSeller
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function login({identifier,password}){
    try {
        const response = await authApiInstance.post("/login",{
            identifier,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMe(){
    try {
        const response = await authApiInstance.get("/me");
        return response.data;
    } catch (error) {
        throw error;
    }
}