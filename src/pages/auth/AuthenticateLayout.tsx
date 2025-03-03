import { Outlet, useLoaderData } from "react-router";
import { USER } from "../../util/types";

const AuthenticateLayout = () => {
  const user: USER = useLoaderData();
  return (
    <>
      <Outlet context={user} />
    </>
  );
};

export default AuthenticateLayout;
