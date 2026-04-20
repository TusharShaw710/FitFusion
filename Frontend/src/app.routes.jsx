import { createBrowserRouter } from "react-router";
import LoginPage from "./components/auth/pages/LoginPage";
import RegisterPage from "./components/auth/pages/RegisterPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <h1 className="p-10 text-2xl">Home</h1>,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
]);