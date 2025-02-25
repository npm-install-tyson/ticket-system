import { createBrowserRouter } from 'react-router'

import { RouterProvider } from 'react-router'
import Home from './pages/customer/Home'
import AdminLayout from './pages/admin/AdminLayout'
import AdminHome from './pages/admin/AdminHome'
import Layout from './pages/customer/Layout'
import { loader as eventLoader } from './pages/admin/EventsLists'
import EditEventDetails from './pages/admin/EditEventDetails'
import AddEvent from './pages/admin/AddEvent'
import EventLists from './pages/admin/EventsLists'
import EventDetails, { loader as detailsLoader } from './pages/admin/EventDetails'
import Error from './pages/Error'
import BookSeats from './pages/admin/BookSeats'
import ConfirmTickets from './pages/admin/ConfirmTickets'
import ManageBands from './pages/admin/ManageBands'
import ManageDiscounts from './pages/admin/ManageDiscounts'


const App = () => {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />
        }
      ]
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children : [
        {
          path: 'dashboard',
          element: <AdminHome />
        },
        {
          path: 'events',
          children:[
            {
              index: true,
              element: <EventLists />,
              loader: eventLoader
            },
            {
              path: ':id/edit',
              element: <EditEventDetails />
            },
            {
              path: 'add',
              element: <AddEvent />,
            },
            {
              path: ':id/details',
              element: <EventDetails />,
              loader: detailsLoader
            },
            {
              path: ':eventId/book/:showId',
              element: <BookSeats/>
            },
            {
              path: 'confirm-tickets',
              element: <ConfirmTickets />
            }
          ]
        },
        {
          path: 'bands',
          element: <ManageBands />
        },
        {
          path: 'discounts',
          element: <ManageDiscounts />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App