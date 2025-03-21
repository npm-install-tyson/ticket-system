import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { REGISTERDATA } from "../../util/types";
import { postData } from "../../services/api/fetchAPI";

const Register = () => {
  const navigate = useNavigate();

  const [registerDetails, setRegisterDetails] = useState<REGISTERDATA>({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const registerInputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    if (id === "mobileNo") {
      const formattedNumber = value.replace(/\D/g, "");
      setRegisterDetails((prev) => ({ ...prev, mobileNo: formattedNumber }));
    } else {
      setRegisterDetails((prev) => ({ ...prev, [id]: value }));
    }
  };
  const blockReg = registerDetails.password !== registerDetails.confirmPassword;

  const registerHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const reqData = {
      name: registerDetails.firstName + " " + registerDetails.lastName,
      mobileNo: registerDetails.mobileNo,
      email: registerDetails.email,
      password: registerDetails.password,
    };
    const signUpPath = `api/v1/auth/signup`;
    postData(signUpPath, reqData).then((response: any) => {
      if (response && (response.status === 200 || response.status <= 300)) {
        const loginPath = `api/v1/auth/login`;
        const reqData = {
          email: registerDetails.email,
          password: registerDetails.password,
        };
        if (localStorage.getItem("token") || localStorage.getItem("userId")) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        }
        postData(loginPath, reqData).then((response: any) => {
          if (response && response.status === 200) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.userId);
            navigate("/");
          } else {
            alert("Failed to login. Please try again.");
          }
        });
      } else if (response.request.status === 409) {
        alert("Email already exists. Please use a different email.");
      } else {
        alert("Failed to register. Please try again.");
      }
    });
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <button onClick={() => navigate("/")}>&larr; Back</button>
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=cyan&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign up a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={registerHandler}
          className="gap-y-6 gap-x-4 grid grid-col-4"
        >
          <div className="col-span-2">
            <label
              htmlFor="firstName"
              className="block text-sm/6 font-medium text-gray-900"
            >
              First Name
            </label>
            <div className="mt-2">
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={registerDetails.firstName}
                onChange={registerInputChangeHandler}
                required
                placeholder="John"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="LastName"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Last Name
            </label>
            <div className="mt-2">
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={registerDetails.lastName}
                onChange={registerInputChangeHandler}
                required
                placeholder="Doe"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="col-span-4">
            <label
              htmlFor="mobileNo"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Phone Number
            </label>
            <div className="mt-2">
              <input
                id="mobileNo"
                name="mobileNo"
                type="text"
                value={registerDetails.mobileNo}
                onChange={registerInputChangeHandler}
                placeholder="07123456789"
                minLength={10}
                maxLength={12}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className="col-span-4">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={registerDetails.email}
                onChange={registerInputChangeHandler}
                required
                placeholder="example@email.com"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div className=" col-span-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2 space-y-1">
              <input
                id="password"
                name="password"
                type="password"
                value={registerDetails.password}
                onChange={registerInputChangeHandler}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
              {blockReg && (
                <p className=" text-red-600 text-xs">Passwords do not match</p>
              )}
            </div>
          </div>
          <div className=" col-span-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirmPassword"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2 space-y-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={registerInputChangeHandler}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-cyan-600 sm:text-sm/6"
              />
              {blockReg && (
                <p className=" text-red-600 text-xs">Passwords do not match</p>
              )}
            </div>
          </div>
          <div className=" col-span-4">
            <button
              disabled={blockReg}
              type="submit"
              className="flex w-full justify-center rounded-md disabled:bg-gray-600 bg-cyan-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Already have an acoount?{" "}
          <Link
            to="/auth/login"
            className="font-semibold text-cyan-600 hover:text-cyan-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};
export default Register;
