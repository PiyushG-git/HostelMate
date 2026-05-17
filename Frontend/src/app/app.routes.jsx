import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetail from "../features/products/pages/ProductDetail";
import SellerProductDetails from "../features/products/pages/SellerProductDetails";
import Watchlist from "../features/products/pages/Watchlist";
import UserProfile from "../features/products/pages/UserProfile";
import AppLayout from "./Applayout";

export const routes = createBrowserRouter([

    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:productId",
                element: <ProductDetail />
            },
            {
                path: "/post-ad",
                element: <Protected>
                    <CreateProduct />
                </Protected>
            },
            {
                path: "/dashboard",
                element: <Protected>
                    <Dashboard />
                </Protected>
            },
            {
                path: "/dashboard/product/:productId",
                element: <Protected>
                    <SellerProductDetails />
                </Protected>
            },
            {
                path: "/watchlist",
                element: <Protected>
                    <Watchlist />
                </Protected>
            },
            {
                path: "/profile",
                element: <Protected>
                    <UserProfile />
                </Protected>
            }
        ]
    }
])