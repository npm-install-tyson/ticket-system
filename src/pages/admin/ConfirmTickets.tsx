import {
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { FormEvent, useEffect, useState } from "react";

const ConfirmTickets = () => {
  const [seatsByBand, setSeatsByBand] = useState<{ [key: string]: number }>({});
  const [isChecked, setIsChecked] = useState(false);
  const [customerAllocation, setCustomerAllocation] = useState<{
    [key: string]: { [key: string]: number };
  }>({});

  useEffect(() => {
    const savedSeatsByBand = localStorage.getItem("seatsByBand");
    if (savedSeatsByBand) {
      setSeatsByBand(JSON.parse(savedSeatsByBand));
    }
  }, []);

  // Initialize customer type selection
  const initializeAllocation = () => {
    const initialAllocation: { [key: string]: { [key: string]: number } } = {};
    for (const band in seatsByBand) {
      initialAllocation[band] = { Child: 0, Adult: 0, Pensioner: 0 };
    }
    setCustomerAllocation(initialAllocation);
  };

  useEffect(() => {
    if (Object.keys(seatsByBand).length > 0) {
      initializeAllocation();
    }
  }, [seatsByBand]);

  // Initialize customer type selection
  useEffect(() => {
    if (Object.keys(seatsByBand).length > 0) {
      initializeAllocation();
    }
  }, [seatsByBand]);

  // Handle customer type allocation per band
  const handleAllocationChange = (
    band: string,
    type: string,
    value: number
  ) => {
    if (value < 0) return; // Prevent negative values
    setIsChecked(false);

    setCustomerAllocation((prev) => {
      const updated = { ...prev };
      const totalAssigned = Object.values(updated[band] || {}).reduce(
        (sum, val) => sum + val,
        0
      );
      const availableSeats = seatsByBand[band] || 0;

      // Ensure total seats assigned does not exceed available seats in this band
      if (totalAssigned + value - (updated[band]?.[type] || 0) > availableSeats)
        return prev;

      updated[band] = { ...updated[band], [type]: value };
      return updated;
    });
  };

  // Calculate remaining seats for each band
  const getRemainingSeats = (band: string) => {
    const assignedSeats = Object.values(customerAllocation[band] || {}).reduce(
      (sum, val) => sum + val,
      0
    );
    return (seatsByBand[band] || 0) - assignedSeats;
  };

  // Handle reset when checkbox is checked
  const handleResetChange = () => {
    setIsChecked((prev) => !prev); // Toggle checkbox state
    initializeAllocation(); // Reset allocation
  };

  // 🔥 Calculate total remaining seats across all bands
  const totalRemainingSeats = Object.keys(seatsByBand).reduce(
    (sum, band) => sum + getRemainingSeats(band),
    0
  );

  if (!seatsByBand || Object.keys(seatsByBand).length === 0) {
    return <p>Loading seat data...</p>;
  }

  const handleCheckOut= (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Confirm Your Tickets
      </h1>
      <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16" onSubmit={handleCheckOut}>
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">
            Confirm Your Tickets
          </h2>

          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-b border-gray-200"
          >
            {Object.entries(seatsByBand).map(([band, totalSeats]) => (
              <li key={band} className="flex py-6 sm:py-10 justify-between">
                <div className="flex flex-col ">
                  <h3>Band {band} Tickets</h3>
                  <p>
                    {getRemainingSeats(band)}/{totalSeats} remaining
                  </p>
                </div>
                {["Child", "Adult", "Pensioner"].map((type) => (
                  <div
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <label>{type}: </label>
                    <input
                      type="number"
                      value={customerAllocation[band]?.[type] || 0}
                      min="0"
                      max={totalSeats}
                      onChange={(e) =>
                        handleAllocationChange(
                          band,
                          type,
                          parseInt(e.target.value, 10)
                        )
                      }
                    />
                  </div>
                ))}
              </li>
            ))}
            <li className="flex py-6 sm:py-10 gap-x-3">
              <input
                type="checkbox"
                name="socialClub"
                id="socialClub"
                checked={isChecked}
                onChange={handleResetChange}
              />
              <label htmlFor="socialClub">
                Booking tickets for Social Club?
              </label>
            </li>
          </ul>
        </section>

        {/* Order summary */}
        <section
          aria-labelledby="summary-heading"
          className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
        >
          <h2
            id="summary-heading"
            className="text-lg font-medium text-gray-900"
          >
            Order summary
          </h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">$99.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex items-center text-sm text-gray-600">
                <span>Shipping estimate</span>
                <a
                  href="#"
                  className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">
                    Learn more about how shipping is calculated
                  </span>
                  <QuestionMarkCircleIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                </a>
              </dt>
              <dd className="text-sm font-medium text-gray-900">$5.00</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="flex text-sm text-gray-600">
                <span>Tax estimate</span>
                <a
                  href="#"
                  className="ml-2 shrink-0 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">
                    Learn more about how tax is calculated
                  </span>
                  <QuestionMarkCircleIcon
                    aria-hidden="true"
                    className="size-5"
                  />
                </a>
              </dt>
              <dd className="text-sm font-medium text-gray-900">$8.32</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <dt className="text-base font-medium text-gray-900">
                Order total
              </dt>
              <dd className="text-base font-medium text-gray-900">$112.32</dd>
            </div>
          </dl>

          <div className="mt-6">
            <button
              disabled={totalRemainingSeats > 0 && !isChecked}
              type="submit"
              className=" disabled:bg-gray-500 w-full rounded-md border border-transparent bg-cyan-800 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-800 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
            >
              Checkout
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default ConfirmTickets;
