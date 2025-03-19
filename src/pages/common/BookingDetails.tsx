import { useEffect, useState } from "react";
import { useLocation } from "react-router";
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
          <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            It's on the way!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your order #14034056 has shipped and will be with you soon.
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="text-gray-900">Tracking number</dt>
            <dd className="mt-2 text-indigo-600">51547878755545848512</dd>
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
                    <a href={`/events/${eventData?.eventId}`}>
                      {eventData?.name} ({eventData.genre})
                    </a>
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
                <dl className="flex divide-x divide-gray-200 text-sm">
                  <div className="flex pr-4 sm:pr-6">
                    <dt className="font-medium text-gray-900">Venue</dt>
                    <dd className="ml-2 text-gray-700">
                      Greenwich Community Theatre
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-1 items-end">
                  {ticketData && (
                    <dl className="flex divide-x divide-gray-200 text-sm">
                      <div className="flex pr-4 sm:pr-6">
                        <dt className="font-medium text-gray-900">Seats</dt>
                        <dd className="ml-2 text-gray-700">
                          {ticketData.seatNumbers}
                        </dd>
                      </div>
                      <div className="flex pl-4 sm:pl-6">
                        <dt className="font-medium text-gray-900">
                          Total Price
                        </dt>
                        <dd className="ml-2 text-gray-700">
                          £{ticketData.totalPrice}
                        </dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Your information</h3>

            <h4 className="sr-only">Addresses</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Shipping address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">Kristin Watson</span>
                    <span className="block">7363 Cynthia Pass</span>
                    <span className="block">Toronto, ON N3Y 4H8</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">Kristin Watson</span>
                    <span className="block">7363 Cynthia Pass</span>
                    <span className="block">Toronto, ON N3Y 4H8</span>
                  </address>
                </dd>
              </div>
            </dl>

            <h4 className="sr-only">Payment</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Payment method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>Apple Pay</p>
                  <p>Mastercard</p>
                  <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>1545
                  </p>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Shipping method</dt>
                <dd className="mt-2 text-gray-700">
                  <p>DHL</p>
                  <p>Takes up to 3 working days</p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700">$36.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex font-medium text-gray-900">
                  Discount
                  <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    STUDENT50
                  </span>
                </dt>
                <dd className="text-gray-700">-$18.00 (50%)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Shipping</dt>
                <dd className="text-gray-700">$5.00</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">$23.00</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BookingDetails;
