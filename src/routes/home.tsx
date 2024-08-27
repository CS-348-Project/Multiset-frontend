import React, { useEffect } from "react";
import GroupCard from "@/components/groups/group-card";
import DefaultLayout from "@/components/layout/default-layout";
import LoadingPage from "@/components/layout/loading-page";
import { useState } from "react";
import { DetailedGroup } from "@/types/Group";
import useProfile from "@/context/profile-context";
import { apiService } from "@/utils/api";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/hooks/withAuth";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const Home = () => {
  const { profile } = useProfile();
  const [groups, setGroups] = useState<DetailedGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/");
    }
    setLoading(true);
    apiService.get(`/api/groups/get?detailed=true`).then((response) => {
      setGroups(response.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <DefaultLayout hideMenu>
      <div className="flex flex-col gap-4 md:gap-8 md:p-6">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl">
          Welcome Back, {profile?.first_name}!
        </h1>

        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mb-12">
          {/* Existing Groups */}
          {groups?.length > 0 &&
            groups.map((group) => (
              <React.Fragment key={group.id}>
                <GroupCard group={group} />
              </React.Fragment>
            ))}
        </div>
        {/* New Group Button */}
        <div className="bottom-4 lg:bottom-8 left-0 fixed flex w-full justify-center h-12 z-10">
          <Link to="/groups/new">
            <Button
              variant="default"
              className="w-auto h-full bg-blue hover:bg-blue/80"
            >
              <PlusIcon className="h-8 w-8" />
            </Button>
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Home;
