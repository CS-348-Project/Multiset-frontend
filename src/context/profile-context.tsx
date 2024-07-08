import { apiService } from "@/utils/api";
import { UserInfo } from "@/types/UserInfo";
import { createContext, useContext, useEffect, useState } from "react";

type ProfileContextType = {
  profile: UserInfo | null;
};

const ProfileContext = createContext({} as ProfileContextType);

const ProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<UserInfo | null>(null);

  useEffect(() => {
    apiService.get("/api/auth/user").then((response) => {
      if (!response) {
        console.error("Problem fetching profile");
        return;
      }
      setProfile(response.data[0]);
    });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("Profile must be used within ProfileContextProvider");
  return context;
};

export { ProfileContextProvider };
export default useProfile;
