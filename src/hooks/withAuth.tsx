import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

const withAuth = (children: React.ReactElement) => {
  const AuthComponent: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
      if (!isLoggedIn()) {
        navigate("/");
      }
    }, [navigate]);

    return children;
  };

  return <AuthComponent />;
};

export default withAuth;
