import {
  ArrowRightIcon,
  TicketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const AdminHome = () => {
  const topEvents = [
    {
      id: 1,
      name: "Peter Pan",
      ticketSold: 150,
    },
    {
      id: 2,
      name: "STOOPID",
      ticketSold: 135,
    },
    {
      id: 3,
      name: "Persephone: A Tale of the Seasons",
      ticketSold: 115,
    },
    {
      id: 4,
      name: "The Magic Bookmark",
      ticketSold: 115,
    },
    {
      id: 5,
      name: "The Railway Children",
      ticketSold: 90,
    },
  ];

  return (
    <div className="mx-auto max-w-2xl lg:max-w-7xl">
      <div className="flex-col lg:flex-row gap-y-6 lg:gap-y-0 flex justify-center items-start gap-x-6">
        <div className="flex flex-col items-center w-full gap-y-6">
          <div className="flex w-full justify-center items-center gap-x-6">
            {/* Total Customers */}
            <div className="overflow-hidden rounded-lg bg-white shadow-sm w-full flex flex-col outline outline-cyan-600">
              <div className="px-4 py-5 sm:p-6">
                <UsersIcon className="rounded-xl p-3 bg-gray-100 text-gray-700 w-12" />
              </div>
              <div className="px-6 text-gray-700 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Customers
                  </span>
                  <span className="text-3xl font-extrabold mb-6 mt-3">
                    3,100
                  </span>
                </div>
                <a
                  href=""
                  className="rounded-sm bg-cyan-800 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
                >
                  Customer Lists
                </a>
              </div>
            </div>

            {/* Something Coming */}
            <div className="overflow-hidden rounded-lg bg-white shadow-sm w-full flex flex-col outline outline-cyan-600">
              <div className="px-4 py-5 sm:p-6">
                <TicketIcon className="rounded-xl p-3 bg-gray-100 text-gray-700 w-12" />
              </div>
              <div className="px-6 text-gray-700 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-500">
                    Tickets Sold
                  </span>
                  <span className="text-3xl font-extrabold mb-6 mt-3">
                    3,100
                  </span>
                </div>
                <a
                  href=""
                  className="rounded-sm bg-cyan-800 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
                >
                  Customer Lists
                </a>
              </div>
            </div>
          </div>

          {/* Top Events */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm w-full flex flex-col outline outline-cyan-600">
            <div className="px-6 py-5 sm:px-6">
              <span className="text-lg font-bold">Top Events</span>
            </div>
            <div className="px-6 text-gray-700">
              <div className="flex flex-col">
                <div className="flex justify-between border-t border-t-gray-600 py-1">
                  <span className="text-sm font-medium text-gray-400">
                    Event Names
                  </span>
                  <span className="text-sm font-medium text-gray-400">
                    Total Tickets Booked
                  </span>
                </div>
                {topEvents.length > 0 &&
                  topEvents.map((e) => (
                    <div
                      className="flex justify-between border-t border-t-gray-600 py-3"
                      key={e.id}
                    >
                      <span className="text-sm font-medium text-gray-600">
                        {e.name}
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {e.ticketSold}
                      </span>
                    </div>
                  ))}
                <div className="py-3">
                  <a
                    href=""
                    className="gap-x-1 flex justify-center items-center rounded-sm bg-white outline outline-cyan-800 p-2 text-xs font-semibold text-gray-600 shadow-xs hover:bg-cyan-700 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
                  >
                    See All <ArrowRightIcon className=" w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Booking */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm w-full outline outline-cyan-600">
          <div className="px-4 py-5 sm:p-6">
            <span className=" text-lg font-bold mb-6">Recent Bookings</span>
          </div>
          <div className="px-6 text-gray-700 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-500">
                Customers
              </span>
              <span className="text-3xl font-extrabold mb-6 mt-3">3,100</span>
            </div>
            <a
              href=""
              className="rounded-sm bg-cyan-800 px-2 py-1 text-xs font-semibold text-white shadow-xs hover:bg-cyan-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-800"
            >
              Customer Lists
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
