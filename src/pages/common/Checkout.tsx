import { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useLocation, useNavigate, useParams } from "react-router";
import {
  CARDVALIDATIONSTATE,
  CONTACTINFORMATION,
  DELIVERYMETHOD,
  EVENTDETAILS,
  PAYMENTCARDDETAILS,
  SHOWTIME,
} from "../../util/types";
import BookingSummary from "../../components/BookingSummary";
import PaymentSection from "../../components/PaymentSection";
import ShippingInformation from "../../components/ShippingInformation";
import { getData, postData } from "../../services/api/fetchAPI";

type SeatsByBand = Record<string, number>;

const deliveryMethods: DELIVERYMETHOD[] = [
  {
    id: 1,
    title: "Email",
    turnaround: "Instant",
    price: 0.0,
  },
  {
    id: 2,
    title: "Standard",
    turnaround: "3–5 business days",
    price: 5.0,
  },
  {
    id: 3,
    title: "Express",
    turnaround: "1–2 business days",
    price: 10.0,
  },
];

const Checkout = () => {
  const { eventId, showId } = useParams();
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState<DELIVERYMETHOD>(deliveryMethods[0]);

  const [cardDetails, setCardDetails] = useState<PAYMENTCARDDETAILS>({
    cardNumber: "",
    cardHolderName: "",
    cardExpiry: "",
    cardCVC: "",
  });

  const location = useLocation();
  const data = JSON.parse(location.state?.discount).data;

  const navigate = useNavigate();
  const [seatsByBand, setSeatsByBand] = useState<SeatsByBand>({});
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const BookSeatsPage = `/admin/events/${eventId}/${showId}`;

  const counterEndTime = localStorage.getItem("counterEndTime");
  const timeLeft =
    counterEndTime &&
    parseInt(counterEndTime, 10) - Math.floor(Date.now() / 1000);

  timeLeft &&
    setTimeout(() => {
      localStorage.removeItem("occupiedSeats");
      localStorage.removeItem("seatsByBand");
      if (seatsByBand != null) {
        navigate(BookSeatsPage);
      }
    }, timeLeft * 1000);

  const [event, setEvent] = useState<EVENTDETAILS>();
  const [showTime, setShowTime] = useState<SHOWTIME[]>([]);
  const [email, setEmail] = useState<string>();
  const [contactInformation, setContactInformation] =
    useState<CONTACTINFORMATION>({
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      country: "United Kingdom",
      state: "",
      zipCode: "",
      phoneNumber: "",
    });

  const [isCardValid, setIsCardValid] = useState<CARDVALIDATIONSTATE>({
    cardNumber: true,
    cardExpiry: true,
  });

  const eventPath = `event/get-event?id=${eventId}`;
  const showTimePath = `event/${eventId}/get-show-times`;
  useEffect(() => {
    getData(eventPath).then((data) => setEvent(data));
    getData(showTimePath)
      .then((data) => data && setShowTime(data))
      .then(() =>
        setShowTime(
          (prev: SHOWTIME[]) =>
            prev && prev.filter((st: SHOWTIME) => st.id === showId)
        )
      );
    // Load saved seat data from localStorage
    const savedSeatsByBand = localStorage.getItem("seatsByBand");
    if (savedSeatsByBand) {
      setSeatsByBand(JSON.parse(savedSeatsByBand));
    }
    const occupiedSeats = localStorage.getItem("occupiedSeats");
    occupiedSeats && setSelectedSeats(JSON.parse(occupiedSeats).selectedSeats);
  }, []);

  // Loading state
  if (!seatsByBand || Object.keys(seatsByBand).length === 0) {
    return <p className="text-center py-10">Loading seat data...</p>;
  }

  const paymentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const paymentPath = `api/v1/payments/process`;

    const reqData = {
      paymentDetails: {
        cardNumber: cardDetails.cardNumber,
        cardHolderName: cardDetails.cardHolderName,
        expiryDate: cardDetails.cardExpiry,
        cvv: cardDetails.cardCVC,
      },
      address: {
        street: contactInformation.address,
        apartment: contactInformation.apartment,
        city: contactInformation.city,
        state: contactInformation.state,
        country: contactInformation.country,
        zipCode: contactInformation.zipCode,
      },
      payableAmount: (data.finalPrice + selectedDeliveryMethod.price).toFixed(
        2
      ),
      name: contactInformation.firstName + " " + contactInformation.lastName,
      email,
      userId: "3e5be21e-b9ad-4bd9-8b23-0cf44e83d52e",
      eventId,
      showId,
      showTime: showTime[0].showTime,
      seatNumbers: selectedSeats,
    };
    postData(paymentPath, JSON.stringify(reqData)).then((data) =>
      console.log(data)
    );
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form
          onSubmit={paymentHandler}
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
        >
          <div>
            {/* Delivery Method */}
            <div>
              <fieldset>
                <legend className="text-lg font-medium text-gray-900">
                  Delivery method
                </legend>
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={setSelectedDeliveryMethod}
                  className="mt-4 flex gap-y-6 sm:gap-x-4"
                >
                  {deliveryMethods.map((deliveryMethod) => (
                    <Radio
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      aria-label={deliveryMethod.title}
                      aria-description={`${deliveryMethod.turnaround} for ${deliveryMethod.price}`}
                      className="group relative basis-1/2 flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-xs focus:outline-hidden data-checked:border-transparent data-focus:ring-2 data-focus:ring-cyan-500"
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">
                            {deliveryMethod.title}
                          </span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            {deliveryMethod.turnaround}
                          </span>
                          <span className="mt-6 text-sm font-medium text-gray-900">
                            &#163;{deliveryMethod.price.toFixed(2)}
                          </span>
                        </span>
                      </span>
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="size-5 text-cyan-600 group-not-data-checked:hidden"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-checked:border-cyan-500 group-data-focus:border"
                      />
                    </Radio>
                  ))}
                </RadioGroup>
              </fieldset>
            </div>

            {/* Contact Information */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>
              <div className="mt-4">
                <div>
                  <label
                    htmlFor="email-address"
                    className="block text-sm/6 font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email-address"
                      name="email-address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      placeholder="example@email.com"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {selectedDeliveryMethod.title !== "Email" && (
              <ShippingInformation
                contactInformation={contactInformation}
                setContactInformation={setContactInformation}
              />
            )}

            <PaymentSection
              isCardValid={isCardValid}
              setIsCardValid={setIsCardValid}
              setCardDetails={setCardDetails}
              cardDetails={cardDetails}
            />
          </div>
          {event && showTime && (
            <BookingSummary
              event={event}
              showTime={showTime}
              data={data}
              selectedDeliveryMethod={selectedDeliveryMethod}
              isCardValid={isCardValid}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
