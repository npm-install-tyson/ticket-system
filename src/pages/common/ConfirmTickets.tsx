import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import CountdownTimer from "../../components/Timer";
import fetchData from "../../util/fetchAPI";
import { getDayOfWeek } from "../../util/getDay";

interface BAND {
  bandId: string;
  seatsPerBand: number;
  price: number;
}

interface BOOKINGDETAILS {
  eventName: string;
  eventGenre: string;
  showTime: string;
}

// Define types for better type safety
type CustomerType = "child" | "adult" | "pensioner";
type SeatsByBand = Record<string, number>;
type CustomerAllocation = Record<string, Record<CustomerType, number>>;

const CUSTOMER_TYPES: CustomerType[] = ["child", "adult", "pensioner"];
const TIMEOUT_DURATION = 600000; // 10 minutes in milliseconds

const ConfirmTickets = () => {
  const [seatsByBand, setSeatsByBand] = useState<SeatsByBand>({});
  const [isBookingForSocialClub, setIsBookingForSocialClub] = useState(false);
  const [customerAllocation, setCustomerAllocation] =
    useState<CustomerAllocation>({});
  // Initialize bandData with empty array right after other state declarations
  const [bandData, setBandData] = useState<BAND[]>([
    { bandId: "", seatsPerBand: 0, price: 0 },
  ]);

  const navigate = useNavigate();
  const location = useLocation();
  const adminEventsPath = "/admin/events";
  const currentPath = "/admin/events/confirm-tickets";

  // Load saved seats data and set timeout for session
  useEffect(() => {
    // Load saved seat data from localStorage
    const savedSeatsByBand = localStorage.getItem("seatsByBand");
    if (savedSeatsByBand) {
      setSeatsByBand(JSON.parse(savedSeatsByBand));
    }
  }, [navigate, location.pathname]);

  const [bookingDetails, setBookingDetails] = useState<BOOKINGDETAILS>({
    eventName: "",
    eventGenre: "",
    showTime: "",
  });

  // Fetch band data with dependency array
  useEffect(() => {
    const bandUrl = `http://192.168.120.169:8080/api/v1/bands/all`;
    fetchData(bandUrl, setBandData);
    const requestBookingDetails = localStorage.getItem("bookingDetails");
    requestBookingDetails &&
      setBookingDetails(JSON.parse(requestBookingDetails));
  }, []);

  // Set timeout for session
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.removeItem("occupiedSeats");
      localStorage.removeItem("seatsByBand");
      if (location.pathname === currentPath) {
        navigate(adminEventsPath);
      }
    }, TIMEOUT_DURATION);

    // Clean up the timeout when component unmounts
    return () => clearTimeout(timeoutId);
  }, [location.pathname, currentPath, navigate, adminEventsPath]);

  // Initialize customer allocation whenever seatsByBand changes
  useEffect(() => {
    if (Object.keys(seatsByBand).length > 0) {
      initializeAllocation();
    }
  }, [seatsByBand]);

  // Initialize customer allocation with zero values for each type
  const initializeAllocation = () => {
    const initialAllocation: CustomerAllocation = {};

    for (const band in seatsByBand) {
      initialAllocation[band] = {
        child: 0,
        adult: 0,
        pensioner: 0,
      };
    }
    setCustomerAllocation(initialAllocation);
  };

  // Handle changes to customer allocation for a specific band and type
  const handleAllocationChange = (
    band: string,
    type: CustomerType,
    value: number
  ) => {
    if (value < 0) return; // Prevent negative values
    setIsBookingForSocialClub(false);

    setCustomerAllocation((prev) => {
      const updated = { ...prev };

      // Calculate total seats already assigned for this band
      const totalAssigned = Object.values(updated[band] || {}).reduce(
        (sum, val) => sum + val,
        0
      );

      const currentTypeValue = updated[band]?.[type] || 0;
      const availableSeats = seatsByBand[band] || 0;

      // Check if new allocation would exceed available seats
      const newTotal = totalAssigned + value - currentTypeValue;
      if (newTotal > availableSeats) return prev;

      // Update allocation
      updated[band] = { ...updated[band], [type]: value };
      return updated;
    });
  };

  // Calculate remaining seats for a specific band
  const getRemainingSeats = (band: string): number => {
    const assignedSeats = Object.values(customerAllocation[band] || {}).reduce(
      (sum, val) => sum + val,
      0
    );
    return (seatsByBand[band] || 0) - assignedSeats;
  };

  // Handle social club checkbox change
  const handleSocialClubChange = () => {
    const newValue = !isBookingForSocialClub;
    setIsBookingForSocialClub(newValue);

    if (newValue) {
      initializeAllocation(); // Reset allocation when booking for social club
    }
  };

  // Calculate total remaining seats across all bands
  const totalRemainingSeats = Object.keys(seatsByBand).reduce(
    (sum, band) => sum + getRemainingSeats(band),
    0
  );

  // Handle checkout form submission
  const handleContinue = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const totalTickets = Object.values(seatsByBand).reduce(
      (sum, count) => sum + count,
      0
    );
    const band = {
      A: {
        child: 0,
        adult: 0,
        pensioner: 0,
      },
      B: {
        child: 0,
        adult: 0,
        pensioner: 0,
      },
      C: {
        child: 0,
        adult: 0,
        pensioner: 0,
      },
    };

    const updatedBand = isBookingForSocialClub
      ? {
          ...band,
          ...Object.keys(customerAllocation).reduce((acc, key) => {
            const bandKey = key as keyof typeof band;
            acc[bandKey] = {
              ...band[bandKey],
              ...customerAllocation[bandKey],
            };
            return acc;
          }, {} as typeof band),
        }
      : {
          A: {
            child: 0,
            adult: seatsByBand.A,
            pensioner: 0,
          },
          B: {
            child: 0,
            adult: seatsByBand.B,
            pensioner: 0,
          },
          C: {
            child: 0,
            adult: seatsByBand.C,
            pensioner: 0,
          },
        };

    const requestData = {
      bands: updatedBand,
      isSocialClub: isBookingForSocialClub,
      totalTickets,
      day: getDayOfWeek(bookingDetails.showTime),
      showTime: bookingDetails.showTime,
    };

    localStorage.setItem("requestData", JSON.stringify(requestData));

    navigate("checkout");
  };

  // Input control handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Tab", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!e.ctrlKey && !e.metaKey && !e.altKey && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const allocationsAndDiscount = (
    band: string,
    type: CustomerType,
    e: string
  ) => {
    handleAllocationChange(band, type, parseInt(e, 10) || 0);
  };

  // Loading state
  if (!seatsByBand || Object.keys(seatsByBand).length === 0) {
    return <p className="text-center py-10">Loading seat data...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex-col flex">
        <h1 className="text-3xl text-center py-4 font-bold tracking-tight text-gray-900 sm:text-4xl">
          Confirm Your Tickets
        </h1>
        <CountdownTimer />
      </div>
      <form className="" onSubmit={handleContinue}>
        {/* Ticket selection section */}
        <section aria-labelledby="cart-heading">
          <h2 id="cart-heading" className="sr-only">
            Confirm Your Tickets
          </h2>

          <ul
            role="list"
            className="divide-y divide-gray-200 border-t border-b border-gray-200"
          >
            {/* Render band selections */}
            {Object.entries(seatsByBand).map(([band, totalSeats]) => (
              <li
                key={band}
                className="flex py-6 sm:py-10 justify-between items-center"
              >
                <div className="flex flex-col">
                  <h3>Band {band} Tickets</h3>
                  <p>
                    {getRemainingSeats(band)}/{totalSeats} remaining
                  </p>
                </div>
                {/* Display price if band data is available */}
                {bandData.find((b) => b.bandId === band) && (
                  <p>
                    £{bandData.find((b) => b.bandId === band)?.price} per ticket
                  </p>
                )}

                {/* Render customer type inputs for each band */}
                {CUSTOMER_TYPES.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <label className="capitalize">{type}: </label>
                    <input
                      type="number"
                      className="w-16 p-1 border rounded"
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      min="0"
                      max={totalSeats}
                      value={customerAllocation[band]?.[type] || 0}
                      onChange={(e) =>
                        allocationsAndDiscount(band, type, e.target.value)
                      }
                    />
                  </div>
                ))}
              </li>
            ))}

            {/* Social club checkbox */}
            <li className="flex py-6 sm:py-10 gap-x-3">
              <input
                type="checkbox"
                name="socialClub"
                id="socialClub"
                checked={isBookingForSocialClub}
                onChange={handleSocialClubChange}
              />
              <label htmlFor="socialClub">
                Booking tickets for Social Club?
              </label>
            </li>
            <li className="py-6 sm:py-10 flex justify-center items-center">
              <button
                disabled={totalRemainingSeats > 0 && !isBookingForSocialClub}
                type="submit"
                className="w-full rounded-md border border-transparent bg-cyan-800 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-800 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden disabled:bg-gray-500"
              >
                Continue
              </button>
            </li>
          </ul>
        </section>

        {/* Order summary section is commented out in original code */}
      </form>
    </div>
  );
};

export default ConfirmTickets;
