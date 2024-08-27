import { apiService } from "@/utils/api";
import { UserInfo } from "@/types/UserInfo";
import { createContext, useContext, useEffect, useState } from "react";
import { Group } from "@/types/Group";

type ProfileContextType = {
  profile: UserInfo | null;
  refetchProfile: () => void;
  groups: Group[] | null;
  refetchGroups: () => void;
};

const ProfileContext = createContext({} as ProfileContextType);

const ProfileContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [groups, setGroups] = useState<Group[] | null>(null);

  const fetchProfile = async () => {
    try {
      const response = await apiService.get("/api/auth/user");
      setProfile(response.data[0]);
    } catch {
      console.error("Problem fetching profile");
    }
  };
  const refetchProfile = fetchProfile;

  const fetchGroups = async () => {
    try {
      const response = await apiService.get(`/api/groups/get`);
      setGroups(response.data);
    } catch {
      console.error("Problem fetching groups");
    }
  };
  const refetchGroups = () => {
    if (!profile) return;
    fetchGroups();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;
    fetchGroups();
  }, [profile]);

  return (
    <ProfileContext.Provider
      value={{ profile, refetchProfile, groups, refetchGroups }}
    >
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

export { ProfileContextProvider, useProfile as default };
