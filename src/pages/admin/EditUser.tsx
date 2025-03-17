import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router";
import { getData, putData } from "../../services/api/fetchAPI";
import UserForm from "../../components/UserForm";
import { useState } from "react";
import { REGISTERDATA } from "../../util/types";

const EditUser = () => {
  const getUser = useLoaderData();
  const navigate = useNavigate();

  const [regDetails, setRegDetails] = useState<REGISTERDATA>({
    firstName: getUser.name.split(" ")[0],
    lastName: getUser.name.split(" ")[1],
    mobileNo: getUser.mobileNo,
    email: getUser.email,
    password: "",
    confirmPassword: "",
    isAdmin: getUser.role === "ADMIN",
  });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const path = `api/v1/users/${getUser.userId}/update`;
    const reqData = {
      name: regDetails.firstName + " " + regDetails.lastName,
      mobileNo: regDetails.mobileNo,
      email: regDetails.email,
      password: regDetails.password,
      role: regDetails.isAdmin ? "ADMIN" : "USER",
    };
    putData(path, reqData).then((res) => res?.data && navigate("/admin/users"));
  };
  return (
    <UserForm
      regDetails={regDetails}
      setRegDetails={setRegDetails}
      submitHandler={submitHandler}
      isAddNew={false}
    />
  );
};

export default EditUser;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const path = `api/v1/users/${params.id}`;
  const response = await getData(path).then((data) => data || {});
  return await response;
};
