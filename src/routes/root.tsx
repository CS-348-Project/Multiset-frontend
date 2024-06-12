import { apiService } from "@/utils/api";
import { GoogleLogin } from "@react-oauth/google";

const Root = () => {
  const handleLogin = (response) => {
    console.log(response);
    apiService
      .post("api/auth/google", { token: response.credential })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="w-screen h-screen bg-orange-50">
      <div className="w-full h-full flex items-center justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            handleLogin(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
};

export default Root;
