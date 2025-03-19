import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { getData } from "../../services/api/fetchAPI";
import { EVENTDETAILS, SHOWTIME } from "../../util/types";
import { formatShowtime } from "../../util/formatShowtime";

const BookingDetails = () => {
  const location = useLocation();

  const ticketNumber = location.state.ticketNumber;
  const eventId = location.state.eventId;
  const showId = location.state.showId;

  const [ticketData, setTicketData] = useState<any>();
  const [eventData, setEventData] = useState<EVENTDETAILS>();
  const [showData, setShowData] = useState<SHOWTIME[]>([]);

  const ticketPath = `api/v1/tickets/${ticketNumber}`;
  const eventPath = `event/get-event?id=${eventId}`;
  const showPath = `event/${eventId}/get-show-times`;

  console.log(ticketData);

  useEffect(() => {
    getData(ticketPath).then(
      (ticketData) => ticketData && setTicketData(ticketData)
    );
    getData(eventPath).then(
      (eventData) => eventData && setEventData(eventData)
    );
    getData(showPath)
      .then((showData) => showData && setShowData(showData))
      .then(() =>
        setShowData(
          (prev: SHOWTIME[]) =>
            prev && prev.filter((st: SHOWTIME) => st.id === showId)
        )
      );
  }, []);

  const formattedShowTime = formatShowtime(
    showData.length > 0 ? showData[0].showTime : ""
  );

  return (
    <main className="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-cyan-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            It's on the way!
          </p>
          {ticketData && (
            <p className="mt-2 text-base text-gray-500">
              Your order #{ticketNumber.split("-")[0]} will be delivered to you
              soon.
            </p>
          )}

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Ticket reference number</dt>
            <dd className="mt-2 text-cyan-600">{ticketNumber}</dd>
          </dl>
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-10 border-t border-gray-200"
        >
          <h2 id="order-heading" className="sr-only">
            Your order
          </h2>

          <h3 className="sr-only">Items</h3>
          {eventData && (
            <div className="flex space-x-6 border-b border-gray-200 py-10">
              <img
                src={eventData?.imageUrl}
                className="size-20 flex-none rounded-lg bg-gray-100 object-cover sm:size-40"
              />
              <div className="flex flex-auto flex-col">
                <div>
                  <h4 className="font-medium text-gray-900">
                    <Link
                      to={`/events/${eventData?.eventId}`}
                      className="text-cyan-800"
                    >
                      {eventData?.name} ({eventData.genre})
                    </Link>
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 text-justify">
                    {/* {eventData?.description} */}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formattedShowTime.date}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formattedShowTime.time}
                  </p>
                </div>
                <div className="mt-6 flex flex-col">
                  <div className="flex text-sm gap-x-4">
                    <dt className="font-medium text-gray-900">Venue</dt>
                    <dd className="text-gray-700">
                      Greenwich Community Theatre
                    </dd>
                  </div>
                  {ticketData && (
                    <>
                      <div className="flex text-sm gap-x-4">
                        <dt className="font-medium text-gray-900">Seats</dt>
                        <dd className="text-gray-700">
                          {ticketData.seatNumbers}
                        </dd>
                      </div>
                      <div className="flex text-sm gap-x-4">
                        <dt className="font-medium text-gray-900">
                          Total Price
                        </dt>
                        <dd className="text-gray-700">
                          £{ticketData.totalPrice}
                        </dd>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BookingDetails;
