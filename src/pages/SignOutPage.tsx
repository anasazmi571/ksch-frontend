import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function SignOutPage() {
  const userContext = useContext(UserContext);

  useEffect(() => {
    userContext.signOut();
  }, [userContext]);

  return !!userContext.user ? <></> : <Navigate to='/' replace />;
}