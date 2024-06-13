import { apiService } from "@/utils/api";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleLogin = (response) => {
    console.log(response);
    apiService
      .post("api/auth/google", { token: response.credential })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="w-screen h-screen bg-orange-50">
      <div className="w-full h-full flex items-center justify-center">
        {isLoggedIn ? (
          <div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handleLogin(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Root;
