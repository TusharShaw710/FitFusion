import { createBrowserRouter } from "react-router";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CreateProduct from "./features/products/pages/CreateProduct";


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
    {
        path:"/create-product",
        element:<CreateProduct />
    }
]);