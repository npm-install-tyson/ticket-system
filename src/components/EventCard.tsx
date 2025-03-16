import { Link, useOutletContext } from "react-router";
import { formatDate } from "../util/formatdate";
import { EVENTDETAILS, USER } from "../util/types";

const EventCard = ({ event }: { event: EVENTDETAILS }) => {
  const user: USER = useOutletContext();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  return (
    <div className="rounded-md" key={event.eventId}>
      <div className="relative">
        <div className="relative h-72 w-full overflow-hidden rounded-lg">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="size-full object-cover"
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex h-72 items-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <div className="relative text-lg font-semibold text-white flex flex-col w-full">
            <div className="flex gap-x-2 items-center">
              <h3 className="text-sm font-medium">{event.name}</h3>
              <span className="text-xs font-medium capitalize text-gray-300">
                ({event.genre})
              </span>
            </div>
            <p className="mt-1 text-sm">
              {formatDate(start)} - {formatDate(end)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 gap-y-3 flex flex-col">
        <Link
          to={`${event.eventId}`}
          className="relative flex items-center justify-center rounded-md border border-transparent bg-cyan-900 px-8 py-2 text-sm font-medium text-white hover:bg-cyan-900"
        >
          Book Ticket
        </Link>
        {user && user.role === "ADMIN" && (
          <Link
            to={`${event.eventId}/edit`}
            className="relative flex items-center justify-center rounded-md border border-transparent outline outline-cyan-900 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            Edit Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;
