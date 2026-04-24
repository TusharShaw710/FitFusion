import { createBrowserRouter } from "react-router";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import CreateProduct from "./features/products/pages/CreateProduct";
import SellerDashboard from "./features/products/pages/SellerDashboard";
import Protected from "./features/auth/components/Protected";
import Home from "./features/products/pages/Home";
import ProductDetails from "./features/products/pages/ProductDetails";
import SellerProductDetails from "./features/products/pages/SellerProductDetails";
import CartItems from "./features/cart/pages/CartItems";
import AppLayout from "./AppLayout";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: "cart",
                element: <Protected role="buyer">
                            <CartItems />
                        </Protected>
            },
            
            {
                path: "create-product",
                element: <Protected role="seller">
                            <CreateProduct />
                        </Protected>
            },
            {
                path: "products/edit/:id",
                element: <Protected role="seller">
                            <SellerProductDetails />
                        </Protected>
            },
        ]
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
        path: "/dashboard",
        element: <Protected role="seller">
                    <SellerDashboard /> 
                </Protected>
    }
]);