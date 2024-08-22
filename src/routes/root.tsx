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
    <div className="relative w-screen h-screen bg-white px-12 lg:px-24 overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0">
        <div className="bg-pink absolute filter blur-[60px] h-[200px] w-[200px] animate-pink-blob"></div>
        <div className="bg-purple absolute filter blur-[60px] h-[200px] w-[200px] animate-purple-blob"></div>
        <div className="bg-yellow absolute filter blur-[60px] h-[200px] w-[200px] animate-yellow-blob"></div>
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
                <h2 className="text-left text-2xl font-medium tracking-tight text-foreground mb-2">
                  Log in via Google
                </h2>
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <div className="mt-2">
              <Button onClick={handleLogout} variant="secondary">
                Logout
              </Button>
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
