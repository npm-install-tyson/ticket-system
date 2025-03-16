import { Dispatch, SetStateAction } from "react";
import { REGISTERDATA } from "../util/types";
import UserFormInput from "./UserFormInput";

interface ChildProps {
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  regDetails: REGISTERDATA;
  setRegDetails: Dispatch<SetStateAction<REGISTERDATA>>;
  isAddNew: boolean;
}

const UserForm = ({
  submitHandler,
  regDetails,
  setRegDetails,
  isAddNew = true,
}: ChildProps) => {
  const regInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "mobileNo") {
      setRegDetails((prev) => ({ ...prev, [id]: value.replace(/\D/g, "") }));
    } else {
      setRegDetails((prev) => ({ ...prev, [id]: value }));
    }
  };
  const blockReg = regDetails.password !== regDetails.confirmPassword;
  return (
    <form onSubmit={submitHandler} className="sm:max-w-2xl mx-auto">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base/7 font-semibold text-gray-900">
            Add New User
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            The information which will be used to create a new user
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <UserFormInput
              id="firstName"
              label="First Name"
              value={regDetails.firstName}
              onChange={regInputHandler}
              colSpan="sm:col-span-3"
              required={isAddNew}
            />
            <UserFormInput
              id="lastName"
              label="Last Name"
              value={regDetails.lastName}
              onChange={regInputHandler}
              colSpan="sm:col-span-3"
              required={isAddNew}
            />
            <UserFormInput
              id="mobileNo"
              label="Phone Number"
              value={regDetails.mobileNo}
              onChange={regInputHandler}
              colSpan="sm:col-span-6"
              required={isAddNew}
              maxLength={12}
              minLength={10}
            />
            <UserFormInput
              id="email"
              label="Email Address"
              type="email"
              value={regDetails.email}
              onChange={regInputHandler}
              colSpan="sm:col-span-6"
              required={isAddNew}
            />
            <UserFormInput
              id="password"
              label="Password"
              type="password"
              value={regDetails.password}
              onChange={regInputHandler}
              colSpan="sm:col-span-6"
              required={isAddNew}
              blockReg={blockReg}
            />
            <UserFormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={regDetails.confirmPassword}
              onChange={regInputHandler}
              colSpan="sm:col-span-6"
              required={isAddNew}
              blockReg={blockReg}
            />
            <div className="flex items-center gap-x-2 sm:col-span-6">
              <input
                type="checkbox"
                name="isAdmin"
                id="isAdmin"
                checked={regDetails.isAdmin}
                onChange={() =>
                  setRegDetails((prev) => ({ ...prev, isAdmin: !prev.isAdmin }))
                }
              />
              <label
                htmlFor="isAdmin"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Admin Account
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          disabled={blockReg}
          type="submit"
          className=" disabled:bg-gray-400 rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
        >
          Create User
        </button>
      </div>
    </form>
  );
};

export default UserForm;
