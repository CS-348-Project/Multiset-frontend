import { apiService } from "@/utils/api";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = (response: any) => {
    console.log(response);
    apiService
      .post("api/auth/google", { token: response.credential })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        navigate("/home");
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="relative w-screen h-screen bg-creme px-12 lg:px-24 overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0">
        <div className="bg-coral absolute filter blur-[60px] h-[200px] w-[200px] animate-coral-blob"></div>
        <div className="bg-navy absolute filter blur-[60px] h-[200px] w-[200px] animate-navy-blob"></div>
        <div className="bg-yellow-500 absolute filter blur-[60px] h-[200px] w-[200px] animate-yellow-blob"></div>
      </div>
      <div className="relative w-full h-full flex items-center">
        <div className="lg:w-1/3 flex flex-col gap-2">
          <h1 className="mt-6 text-left text-6xl font-bold tracking-tight text-foreground">
            Multiset
          </h1>
          <div className="mt-4">
            {isLoggedIn ? (
              <a href="/home">
                <Button variant="default">Navigate to Dashboard</Button>
              </a>
            ) : (
              <div className="flex flex-col">
                <h2 className="text-left text-2xl font-medium tracking-tight text-foreground">
                  Log in to your account
                </h2>
                <p className="text-left text-md text-muted-foreground">
                  Or{" "}
                  <span className="font-medium text-primary">
                    sign up via Google
                  </span>
                </p>
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <div className="mt-2">
              <button onClick={handleLogout} className="underline">
                Logout
              </button>
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
    </div>
  );
};

export default Root;
