import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { CONTACTINFORMATION } from "../util/types";

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  className?: string;
  colSpan?: string;
  value?: string;
  onChange?: any;
  maxLength?: number;
  placeholder?: string;
}

interface ChildProps {
  contactInformation: CONTACTINFORMATION;
  setContactInformation: Dispatch<SetStateAction<CONTACTINFORMATION>>;
}

const ShippingInformation = ({
  contactInformation,
  setContactInformation,
}: ChildProps) => {
  const addressHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    id === "phoneNumber"
      ? setContactInformation((prev) => ({
          ...prev,
          [id]: value.replace(/\D/g, ""),
        }))
      : setContactInformation((prev) => ({
          ...prev,
          [id]: value,
        }));
  };

  return (
    <div className="mt-10 border-t border-gray-200 pt-10">
      <h2 className="text-lg font-medium text-gray-900">
        Shipping information
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <FormInput
          id="firstName"
          label="First name"
          value={contactInformation.firstName}
          onChange={addressHandler}
          placeholder="Daivd"
        />
        <FormInput
          id="lastName"
          label="Last name"
          autoComplete="family-name"
          value={contactInformation.lastName}
          onChange={addressHandler}
          placeholder="Johnson"
        />
        <FormInput
          id="address"
          label="Address"
          autoComplete="street-address"
          colSpan="sm:col-span-2"
          value={contactInformation.address}
          onChange={addressHandler}
          placeholder="123 Main St"
        />
        <FormInput
          id="apartment"
          label="Apartment, suite, etc."
          colSpan="sm:col-span-2"
          value={contactInformation.apartment}
          onChange={addressHandler}
          placeholder="Apt 1"
        />
        <FormInput
          id="city"
          label="City"
          value={contactInformation.city}
          onChange={addressHandler}
          placeholder="London"
        />

        <div>
          <label
            htmlFor="country"
            className="block text-sm/6 font-medium text-gray-700"
          >
            Country
          </label>
          <div className="mt-2">
            <div className="grid grid-cols-1">
              <select
                id="country"
                name="country"
                value={contactInformation.country}
                onChange={(e) =>
                  setContactInformation((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }))
                }
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              >
                <option value={contactInformation.country}>
                  {contactInformation.country}
                </option>
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </div>
        </div>

        <FormInput
          id="state"
          label="State / Province"
          autoComplete="address-level1"
          value={contactInformation.state}
          onChange={addressHandler}
          placeholder="Greater London"
        />
        <FormInput
          id="zipCode"
          label="Postal code"
          value={contactInformation.zipCode}
          onChange={addressHandler}
        />
        <FormInput
          id="phoneNumber"
          label="Phone"
          autoComplete="tel"
          type="tel"
          colSpan="sm:col-span-2"
          value={contactInformation.phoneNumber}
          onChange={addressHandler}
          placeholder="07123456789"
        />
      </div>
    </div>
  );
};

// Reusable input component
const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  autoComplete,
  className = "",
  colSpan = "",
  value,
  onChange,
  maxLength,
  placeholder,
}) => (
  <div className={colSpan}>
    <label htmlFor={id} className="block text-sm/6 font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-2">
      <input
        required
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6 ${className}`}
      />
    </div>
  </div>
);

export default ShippingInformation;
