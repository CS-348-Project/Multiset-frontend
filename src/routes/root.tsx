import { apiService } from "@/utils/api";
import { GoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

  const handleLogin = (response: any) => {
    apiService
      .post("api/auth/google", { token: response.credential })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn(true);
        window.location.href = "/home";
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="relative w-screen h-screen bg-white px-12 overflow-hidden">
      <div className="absolute w-full h-full top-36 left-0 sm:left-[25vw] sm:w-[50vw]">
        <div className="bg-red absolute filter blur-[60px] h-[200px] w-[200px] animate-pink-blob"></div>
        <div className="bg-purple absolute filter blur-[60px] h-[200px] w-[200px] animate-purple-blob"></div>
        <div className="bg-yellow absolute filter blur-[60px] h-[200px] w-[200px] animate-yellow-blob"></div>
      </div>
      <div className="relative w-full h-full text-center flex flex-col justify-between py-8">
        <div className="mt-10">
          <h1 className="mt-10 text-7xl font-bold tracking-tight text-foreground">
            Multiset
          </h1>
          <p className="text-foreground text-md font-normal">
            Multiple ways to settle your bills.
          </p>
        </div>
        <div className="w-full sm:w-60 mx-auto">
          <div className="mt-4">
            {isLoggedIn ? (
              <a href="/home">
                <Button variant="default" className="w-full">
                  Navigate to Dashboard
                </Button>
              </a>
            ) : (
              <h2 className="text-md font-normal text-black mb-4 w-full">
                Sign up or login to get started
              </h2>
            )}
          </div>
          {isLoggedIn ? (
            <div className="mt-2">
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="w-full"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleLogin(credentialResponse);
                }}
                onError={() => {
                  console.error("Login Failed");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Root;
