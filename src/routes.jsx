import Login from "./views/Login";
import Register from "./views/Register";
import Layout from "./layout";
import Home from "./views/Home";
import FindFriends from "./views/FindFriends";
import Profile from "./views/Profile";

const authRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/find-friends",
        element: <FindFriends />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

export default authRoutes;
