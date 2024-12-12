import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import Main from "../Layouts/Main";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import Dashboard from "../Layouts/Dashboard";
import ProtectRoute from "./ProtectRoute";
import AdminRoute from "./AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectRoute><Main/></ProtectRoute>,
    children: [
      {
        path: "/",
        element: <h1>this is home page</h1>
      },
      {
        path: "/lessons",
        element: <h1>This is lesson page</h1>
      }
    ]
  },
  {
    path: "/auth",
    element: <AuthLayout/>,
    children: [
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "login",
        element: <Login/>
      }
    ]
  },
  {
    path: "/dashboard",
    element: <AdminRoute><Dashboard/></AdminRoute>,
    children: [
      {
        path: "/dashboard",
        element: <h1>This </h1>
      }
    ]
  }
]);

export default router;
