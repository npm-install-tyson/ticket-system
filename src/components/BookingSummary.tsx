import React from "react";
import { formatShowtime } from "../util/formatShowtime";
import TenMinuteCounter from "./Timer";

const BookingSummary = ({
  event,
  showTime,
  data,
  isCardValid,
  selectedDeliveryMethod,
}: any) => {
  const formattedShowTime = formatShowtime(
    showTime.length > 0 ? showTime[0].showTime : ""
  );
  const selectedSeats: any = localStorage.getItem("occupiedSeats");

  return (
    <div className="mt-10 lg:mt-0">
      <div className=" flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
        <TenMinuteCounter />
      </div>
      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-xs">
        <h3 className="sr-only">Play you booked</h3>
        <ul role="list" className="divide-y divide-gray-200">
          <li className="flex px-4 py-6 sm:px-6">
            <div className="shrink-0">
              <img src={event.imageUrl} className="w-20 rounded-md" />
            </div>

            <div className="ml-6 flex flex-1 flex-col">
              <div className="flex">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                    {event.name}{" "}
                    <span className="capitalize">({event.genre})</span>
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    {formattedShowTime.date}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formattedShowTime.time}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Seats -{" "}
                    {JSON.parse(selectedSeats).selectedSeats.join(", ", " ")}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Venue - Greenwich Community Theatre
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              &#163;{(data.finalPrice + data.reduction).toFixed(2)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm">Shipping</dt>
            <dd className="text-sm font-medium text-gray-900">
              &#163;{selectedDeliveryMethod.price.toFixed(2)}
            </dd>
          </div>
          {data.reduction !== 0 && (
            <div>
              {Object.entries(data).map(([key, discount]: any) => {
                return (
                  <React.Fragment key={key}>
                    {key === "child" && discount !== 0 && (
                      <div className="flex justify-between items-center text-gray-500">
                        <p className="text-sm">Children Discount</p>
                        <p className="text-sm font-medium opacity-70 text-red-600">
                          -&#163;{discount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {key === "pensioner" && discount !== 0 && (
                      <div className="flex justify-between items-center text-gray-500">
                        <p className="text-sm">Pensioners Discount</p>
                        <p className="text-sm font-medium opacity-70 text-red-600">
                          -&#163;{discount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {key === "weekday" && discount !== 0 && (
                      <div className="flex justify-between items-center text-gray-500">
                        <p className="text-sm">Weekday Special</p>
                        <p className="text-sm font-medium opacity-70 text-red-600">
                          -&#163;{discount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {key === "lastHour" && discount !== 0 && (
                      <div className="flex justify-between items-center text-gray-500">
                        <p className="text-sm">Last Hour Discount</p>
                        <p className="text-sm font-medium opacity-70 text-red-600">
                          -&#163;{discount.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {key === "socialClub" && discount !== 0 && (
                      <div className="flex justify-between items-center text-gray-500">
                        <p className="text-sm">Social Club Discount</p>
                        <p className="text-sm font-medium opacity-70 text-red-600">
                          -&#163;{discount.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
              <div className="flex items-center justify-between">
                <dt className="text-sm">Total Discount</dt>
                <dd className="text-sm font-medium text-red-600">
                  -&#163;{data.reduction.toFixed(2)}
                </dd>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">
              &#163;
              {(data.finalPrice + selectedDeliveryMethod.price).toFixed(2)}
            </dd>
          </div>
        </dl>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <button
            disabled={!isCardValid.cardNumber || !isCardValid.cardExpiry}
            type="submit"
            className="disabled:bg-gray-500 w-full rounded-md border border-transparent bg-cyan-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
