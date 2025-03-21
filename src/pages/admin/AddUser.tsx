import { useState } from "react";
import { REGISTERDATA } from "../../util/types";
import { postData } from "../../services/api/fetchAPI";
import UserForm from "../../components/UserForm";

const AddUser = () => {
  const [regDetails, setRegDetails] = useState<REGISTERDATA>({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const path = "api/v1/auth/signup";
    const reqData = {
      name: regDetails.firstName + " " + regDetails.lastName,
      mobileNo: regDetails.mobileNo,
      email: regDetails.email,
      password: regDetails.password,
      role: regDetails.isAdmin ? "ADMIN" : "USER",
    };
    postData(path, reqData);
  };

  return (
    <UserForm
      submitHandler={submitHandler}
      regDetails={regDetails}
      setRegDetails={setRegDetails}
      isAddNew={true}
    />
  );
};

export default AddUser;
