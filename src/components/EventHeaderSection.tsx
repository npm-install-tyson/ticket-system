import { StarIcon } from "@heroicons/react/20/solid";
import { EVENTDETAILS } from "../util/types";

export const EventHeaderSection = ({
  eventDetails,
  averageRating,
}: {
  eventDetails: EVENTDETAILS;
  averageRating: number;
}) => (
  <div className="flex flex-col-reverse">
    <div className="mt-4">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {eventDetails.name}
      </h1>
      <h2 id="information-heading" className="sr-only">
        Product information
      </h2>
      <p className="mt-2 text-sm text-gray-500 capitalize">
        {eventDetails.genre}
      </p>
    </div>
    <div>
      <h3 className="sr-only">Reviews</h3>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map((rating) => (
          <StarIcon
            key={rating}
            aria-hidden="true"
            className={`size-5 shrink-0 ${
              averageRating > rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);
