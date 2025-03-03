import { createBrowserRouter, redirect } from "react-router";

import { RouterProvider } from "react-router";
import Home from "./pages/customer/Home";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import Layout from "./pages/customer/Layout";
import { loader as eventLoader } from "./pages/common/EventsLists";
import EditEventDetails from "./pages/admin/EditEventDetails";
import AddEvent from "./pages/admin/AddEvent";
import EventLists from "./pages/common/EventsLists";
import EventDetails, {
  loader as detailsLoader,
} from "./pages/common/EventDetails";
import Error from "./pages/Error";
import BookSeats, { loader as seatLoader } from "./pages/common/BookSeats";
import ConfirmTickets from "./pages/common/ConfirmTickets";
import ManageBands from "./pages/admin/ManageBands";
import ManageDiscounts from "./pages/admin/ManageDiscounts";
import Register from "./pages/auth/Register";
import About from "./pages/customer/About";
import Login from "./pages/auth/Login";
import AuthLayout from "./pages/auth/AuthLayout";
import Checkout from "./pages/common/Checkout";
import { USER } from "./util/types";
import AuthenticateLayout from "./pages/auth/AuthenticateLayout";

const App = () => {
  const fetchUser = () => {
    // const userId = localStorage.getItem("userId");
    // const user = userId && getData;
    let user: USER = {
      userId: "id-01",
      name: "John Doe",
      email: "john@example.com",
      isAdmin: true,
    };
    return user;
  };
  const authenticationLoader = () => {
    const user = fetchUser();

    if (!user) {
      return redirect("/auth/login");
    }
    return user;
  };
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      loader: fetchUser,
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "events",
          element: <AuthenticateLayout />,
          children: [
            {
              index: true,
              element: <EventLists />,
              loader: eventLoader,
            },
            {
              path: ":id",
              element: <EventDetails />,
              loader: detailsLoader,
            },
            {
              path: ":eventId/:showId",
              loader: authenticationLoader,
              children: [
                {
                  index: true,
                  element: <BookSeats />,
                  loader: seatLoader,
                },
                {
                  path: "confirm-tickets",
                  element: <ConfirmTickets />,
                },
                {
                  path: "confirm-tickets/checkout",
                  element: <Checkout />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      loader: authenticationLoader,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <AdminHome />,
        },
        {
          path: "events",
          children: [
            {
              index: true,
              element: <EventLists />,
              loader: eventLoader,
            },
            {
              path: "add",
              element: <AddEvent />,
            },
            {
              path: ":id",
              element: <EventDetails />,
              loader: detailsLoader,
            },
            {
              path: ":id/edit",
              element: <EditEventDetails />,
            },
            {
              path: ":eventId/:showId",
              children: [
                {
                  index: true,
                  element: <BookSeats />,
                  loader: seatLoader,
                },
                {
                  path: "confirm-tickets",
                  element: <ConfirmTickets />,
                },
                {
                  path: "confirm-tickets/checkout",
                  element: <Checkout />,
                },
              ],
            },
          ],
        },
        {
          path: "bands",
          element: <ManageBands />,
        },
        {
          path: "discounts",
          element: <ManageDiscounts />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
