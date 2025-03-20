import { Dispatch, SetStateAction, useState } from "react";
import { CARDVALIDATIONSTATE, PAYMENTCARDDETAILS } from "../util/types";

interface ChildProps {
  isCardValid: CARDVALIDATIONSTATE;
  setIsCardValid: Dispatch<SetStateAction<CARDVALIDATIONSTATE>>;
  cardDetails: PAYMENTCARDDETAILS;
  setCardDetails: Dispatch<SetStateAction<PAYMENTCARDDETAILS>>;
}
const PaymentSection = ({
  isCardValid,
  setIsCardValid,
  cardDetails,
  setCardDetails,
}: ChildProps) => {
  const [cardType, setCardType] = useState<string>();

  const detectCardType = (number: string) => {
    // Remove all non-digit characters
    const cleanNumber = number.replace(/\D/g, "");

    // Card type detection logic based on card number prefixes
    if (/^4/.test(cleanNumber)) {
      return "Visa";
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return "Mastercard";
    } else if (/^3[47]/.test(cleanNumber)) {
      return "Amex";
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      return "Discover";
    } else if (/^(?:2131|1800|35)/.test(cleanNumber)) {
      return "JCB";
    } else if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) {
      return "Diners";
    } else {
      return "";
    }
  };
  const paymentDetailsHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    switch (id) {
      case "card-number":
        const formattedNumber = value
          .replace(/\D/g, "")
          .replace(/(.{4})/g, "$1 ")
          .trim();
        setCardDetails((prev) => ({ ...prev, cardNumber: formattedNumber }));
        const type = detectCardType(value);
        setCardType(type);
        type === ""
          ? setIsCardValid((prev) => ({ ...prev, cardNumber: false }))
          : setIsCardValid((prev) => ({ ...prev, cardNumber: true }));
        break;
      case "card-expiry":
        const formattedExpiry = value
          .replace(/\D/g, "")
          .replace(/^([0-9]{2})/, "$1/");
        setCardDetails((prev) => ({ ...prev, cardExpiry: formattedExpiry }));
        parseInt(value.slice(0, 2)) > 12 ||
        parseInt(value.substring(3, 5)) + 2000 < new Date().getFullYear()
          ? setIsCardValid((prev) => ({ ...prev, cardExpiry: false }))
          : setIsCardValid((prev) => ({ ...prev, cardExpiry: true }));
        break;
      case "cvc":
        const formattedCvc = value.replace(/\D/g, "");
        setCardDetails((prev) => ({ ...prev, cardCVC: formattedCvc }));
        break;
      default:
        break;
    }
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-10">
      <h2 className="text-lg font-medium text-gray-900">Payment Information</h2>

      <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
        <div className="col-span-4">
          <label
            htmlFor="card-number"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Card number
          </label>
          <div className="mt-2 grid grid-cols-1">
            <input
              required
              id="card-number"
              name="card-number"
              type="text"
              value={cardDetails.cardNumber}
              onChange={paymentDetailsHandler}
              min={19}
              maxLength={19}
              placeholder="1234 5678 8765 4321"
              className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 ${
                !isCardValid.cardNumber
                  ? "outline-red-300 focus:outline-red-600"
                  : "outline-gray-300 focus:outline-cyan-600"
              }  placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
            />
            {cardType && (
              <div
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 px-3 py-2 self-center justify-self-end text-gray-400"
              >
                {cardType.toUpperCase()}
              </div>
            )}
          </div>
          {!isCardValid.cardNumber && (
            <p id="card-number-error" className="mt-2 text-sm text-red-600">
              Invalid Card Number
            </p>
          )}
        </div>
        <div className="col-span-4">
          <label
            htmlFor="name-on-card"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Name on card
          </label>
          <div className="mt-2 grid grid-cols-1">
            <input
              required
              id="name-on-card"
              name="name-on-card"
              type="text"
              value={cardDetails.cardHolderName}
              onChange={(e) =>
                setCardDetails((prev) => ({
                  ...prev,
                  cardHolderName: e.target.value,
                }))
              }
              maxLength={19}
              placeholder="David Johnson"
              className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-gray-300 focus:outline-cyan-600 outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
            />
          </div>
        </div>
        <div className="col-span-2">
          <label
            htmlFor="card-expiry"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Expiry Date
          </label>
          <div className="mt-2 grid grid-cols-1">
            <input
              required
              id="card-expiry"
              name="card-expiry"
              type="text"
              value={cardDetails.cardExpiry}
              onChange={paymentDetailsHandler}
              maxLength={5}
              placeholder="MM/YY"
              className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 ${
                !isCardValid.cardExpiry
                  ? "outline-red-300 focus:outline-red-600"
                  : "outline-gray-300 focus:outline-cyan-600"
              }  placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
            />
          </div>
          {!isCardValid.cardExpiry && (
            <p id="card-expiry-error" className="mt-2 text-sm text-red-600">
              Invalid Expiration Date
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label
            htmlFor="cvc"
            className="block text-sm/6 font-medium text-gray-900"
          >
            CVC
          </label>
          <div className="mt-2 grid grid-cols-1">
            <input
              required
              id="cvc"
              name="cvc"
              type="text"
              value={cardDetails.cardCVC}
              onChange={paymentDetailsHandler}
              maxLength={cardType === "Amex" ? 4 : 3}
              placeholder="123"
              className={`col-start-1 row-start-1 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-cyan-600 -outline-offset-1 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
