import { createBrowserRouter, redirect } from "react-router";
import { RouterProvider } from "react-router";
import Home from "./pages/customer/Home";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import Layout from "./pages/customer/Layout";
import { loader as eventLoader } from "./pages/common/EventsLists";
import AddEvent from "./pages/admin/AddEvent";
import EventLists from "./pages/common/EventsLists";
import EventDetails, {
  loader as eventDetailsLoader,
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
import AuthenticateLayout from "./pages/auth/AuthenticateLayout";
import { getData } from "./services/api/fetchAPI";
import UserLists, { loader as usersLoader } from "./pages/admin/UserLists";
import EditUser, { loader as editUserLoader } from "./pages/admin/EditUser";
import AddUser from "./pages/admin/AddUser";
import BookingDetails from "./pages/common/BookingDetails";

const App = () => {
  const fetchUser = async () => {
    const userId = localStorage.getItem("userId");
    const path = `api/v1/users/${userId}`;
    const user = userId && (await getData(path).then((data) => data && data));
    // let user: USER = {
    //   userId: "id-01",
    //   name: "John Doe",
    //   email: "john@example.com",
    //   isAdmin: true,
    // };

    return user;
  };
  const authenticationLoader = async () => {
    const user = await fetchUser();

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
              loader: eventDetailsLoader,
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
                {
                  path: "confirm-tickets/checkout/success",
                  element: <BookingDetails />,
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
              loader: eventDetailsLoader,
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
                {
                  path: "confirm-tickets/checkout/success",
                  element: <BookingDetails />,
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
        {
          path: "users",
          children: [
            {
              index: true,
              element: <UserLists />,
              loader: usersLoader,
            },
            {
              path: "add",
              element: <AddUser />,
            },
            {
              path: ":id/edit",
              element: <EditUser />,
              loader: editUserLoader,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
