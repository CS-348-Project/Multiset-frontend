import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const { BACKEND_API_URL } = import.meta.env;

const SocialAuth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      onGoogleLogin(code);
    }
  }, [location.search]);

  const googleLoginHandler = (code: string) => {
    return axios
      .get(`${BACKEND_API_URL}/api/auth/google/${code}`)
      .then((res) => {
        localStorage.setItem("googleFirstName", res.data.user.first_name);
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  };

  const onGoogleLogin = async (code: string) => {
    const response = await googleLoginHandler(code);
    if (response && response.access) {
      navigate("/");
    }
  };

  return null; 
};

export default SocialAuth;
