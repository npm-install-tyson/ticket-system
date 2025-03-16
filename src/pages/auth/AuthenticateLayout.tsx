import { Outlet, useOutletContext } from "react-router";
import { USER } from "../../util/types";

const AuthenticateLayout = () => {
  const user: USER = useOutletContext();

  return (
    <>
      <Outlet context={user} />
    </>
  );
};

export default AuthenticateLayout;
