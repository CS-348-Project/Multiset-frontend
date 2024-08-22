import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/utils/api";
import { CornerUpLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "@/types/UserInfo";
import useProfile from "@/context/profile-context";

export const CreateGroup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, refetchGroups } = useProfile();
  const [groupName, setGroupName] = useState("");
  const [accounts, setAccounts] = useState<UserInfo[]>([]);

  useEffect(() => {
    if (!profile) return;
    setAccounts((p) => [
      profile,
      ...p.filter((a) => a.email !== profile.email),
    ]);
  }, [profile]);

  const createGroup = async () => {
    const groupAccounts = [...accounts];
    if (!groupName) {
      toast({
        title: "Group name is required",
      });
      return;
    }
    if (accounts.length === 0) {
      toast({
        title: "Group must have at least one member",
      });
      return;
    }
    apiService
      .post("/api/groups/create", {
        group_info: {
          name: groupName,
        },
        user_ids: groupAccounts.map((account) => account.id),
      })
      .then((response) => {
        const groupId = response.data.id;

        if (!groupId) {
          toast({
            title: "Group creation failed",
          });
          return;
        }
        toast({
          title: "Group created successfully",
        });
        setGroupName("");
        setAccounts([]);
        refetchGroups();
        navigate(`/groups/${groupId}/add-members`);
      })
      .catch((error) => {
        toast({
          title: error.response.statusText,
        });
      });
  };

  return (
    <>
      <div className="relative w-full h-screen flex items-center justify-center bg-creme">
        <div className="absolute left-4 top-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <CornerUpLeftIcon className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
        </div>
        <Card className="w-full max-w-lg bg-white drop-shadow-md">
          <CardHeader className="space-y-1.5">
            <CardTitle>Create Group</CardTitle>
            <CardDescription>
              Enter a group name to get started!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <Button className="w-full mt-5" onClick={createGroup}>
              Create Group
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
