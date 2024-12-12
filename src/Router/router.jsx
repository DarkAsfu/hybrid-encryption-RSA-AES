import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../Layouts/AuthLayout";
import Main from "../Layouts/Main";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main/>,
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
  }
]);

export default router;
