import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;