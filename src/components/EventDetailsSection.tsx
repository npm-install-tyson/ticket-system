import { formatDate } from "../util/formatdate";
import { EVENTDETAILS } from "../util/types";

export const EventDetailsSection = ({
  eventDetails,
}: {
  eventDetails: EVENTDETAILS;
}) => (
  <div className="mt-10">
    <h3 className="text-sm font-medium text-gray-900">Event Details</h3>
    <div className="mt-4">
      <ul role="list" className="space-y-1 text-sm/6 text-gray-500">
        <li>
          Date: {formatDate(new Date(eventDetails.startDate))} -{" "}
          {formatDate(new Date(eventDetails.endDate))}
        </li>
        <li>Venue: {eventDetails.venue || "Greenwich Community Theatre"}</li>
        <li>Runtime: {eventDetails.duration}</li>
        <li>Director: {eventDetails.director}</li>
        <li>Producer: {eventDetails.producer}</li>
      </ul>
    </div>
  </div>
);
