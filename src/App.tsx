import { createBrowserRouter } from "react-router";

import { RouterProvider } from "react-router";
import Home from "./pages/customer/Home";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import Layout from "./pages/customer/Layout";
import { loader as eventLoader } from "./pages/admin/EventsLists";
import EditEventDetails from "./pages/admin/EditEventDetails";
import AddEvent from "./pages/admin/AddEvent";
import EventLists from "./pages/admin/EventsLists";
import EventDetails, {
  loader as detailsLoader,
} from "./pages/admin/EventDetails";
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

const App = () => {
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
              element: <BookSeats />,
              loader: seatLoader,
            },
            {
              path: ":eventId/:showId/confirm-tickets",
              element: <ConfirmTickets />,
            },
            {
              path: ":eventId/:showId/confirm-tickets/checkout",
              element: <Checkout />,
            },
          ],
        },
      ],
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          path: "dashboard",
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
              element: <BookSeats />,
              loader: seatLoader,
            },
            {
              path: ":eventId/:showId/confirm-tickets",
              element: <ConfirmTickets />,
            },
            {
              path: ":eventId/:showId/confirm-tickets/checkout",
              element: <Checkout />,
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
