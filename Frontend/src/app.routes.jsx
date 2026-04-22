import { createBrowserRouter } from "react-router";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CreateProduct from "./features/products/pages/CreateProduct";
import SellerDashboard from "./features/products/pages/SellerDashboard";
import Protected from "./features/auth/components/Protected";
import Home from "./features/products/pages/Home";
import ProductDetails from "./features/products/pages/ProductDetails";
import SellerProductDetails from "./features/products/pages/SellerProductDetails";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
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
        element:<Protected role="seller">
                    <CreateProduct />
                </Protected>
    },
    {
        path:"/dashboard",
        element:<Protected role="seller">
                    <SellerDashboard /> 
                </Protected>
    },
    {
        path:"/product/:id",
        element:<ProductDetails />
    },
    {
        path:"/products/edit/:id",
        element:<Protected role="seller">
                    <SellerProductDetails />
                </Protected>
    }

]);