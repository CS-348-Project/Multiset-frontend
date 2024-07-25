import DefaultLayout from "@/components/layout/default-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import useProfile from "@/context/profile-context";
import { apiService } from "@/utils/api";
import { UserInfo } from "@/types/UserInfo";
import { CornerUpLeftIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const NewGroup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, refetchGroups } = useProfile();

  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<UserInfo[]>([]);
  const [optimizePayments, setOptimizePayments] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setAccounts((p) => [
      profile,
      ...p.filter((a) => a.email !== profile.email),
    ]);
  }, [profile]);

  const handleAddAccount = async () => {
    if (!email) return;
    if (accounts.some((user) => user.email == email)) {
      toast({
        title: "User already in group",
      });
      return;
    }

    apiService
      .get<UserInfo[]>(`/api/users/?email=${email}`)
      .then((response) => {
        if (response.data.length === 0) {
          toast({
            title: "User not found",
          });
          return;
        }
        const user = response.data[0];

        setAccounts([...accounts, user]);
        setEmail("");
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            title: "User not found",
          });
          return;
        }
        toast({
          title: error.response.statusText,
        });
      });
  };

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

    if (email !== "") {
      if (accounts.some((user) => user.email == email)) {
        return;
      }
      try {
        await apiService
          .get<UserInfo[]>(`/api/users/?email=${email}`)
          .then((response) => {
            if (response.data.length !== 0) {
              groupAccounts.push(response.data[0]);
            }
          });
      } catch (error) {
        // do nothing
      }
    }

    apiService
      .post("/api/groups/create", {
        group: {
          name: groupName,
          optimize_payments: optimizePayments,
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
        navigate(`/groups/${groupId}`);
      })
      .catch((error) => {
        toast({
          title: error.response.statusText,
        });
      });
  };

  if (!profile) return null;

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-creme">
      <div className="absolute left-4 top-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <CornerUpLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
      </div>
      <Card className="w-full max-w-lg bg-white drop-shadow-md">
        <Tabs defaultValue="create" className="text-dusk">
          <TabsList>
            <TabsTrigger value="create">Create Group</TabsTrigger>
            <TabsTrigger value="settings">Group Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <CardHeader className="space-y-1.5">
              <CardTitle>Create Group</CardTitle>
              <CardDescription>
                Enter a group name and add member emails to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberEmails">Member Emails</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="memberEmails"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddAccount();
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddAccount}
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span className="sr-only">Add email</span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {accounts.map((account, idx) => (
                  <div
                    className="flex items-center justify-center bg-creme px-2 py-1 rounded-md text-sm text-dusk"
                    key={account.id}
                  >
                    {`${account.email} - ${account.first_name} ${account.last_name}`}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-fit w-fit text-dusk hover:text-lilac hover:bg-transparent px-1"
                      onClick={() => {
                        setAccounts(accounts.filter((_, i) => i !== idx));
                      }}
                    >
                      {account.email !== profile.email && (
                        <XIcon className="h-4 w-4" />
                      )}
                      <span className="sr-only">Remove email</span>
                    </Button>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={createGroup}>
                Create Group
              </Button>
            </CardContent>
          </TabsContent>
          <TabsContent value="settings">
            <CardHeader className="space-y-1.5">
              <CardTitle>Group Settings</CardTitle>
              <CardDescription>Adjust settings for the group</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <p className="text-dusk text-sm md:text-base">
                  Optimize Payments
                </p>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={optimizePayments}
                  onChange={() => {
                    setOptimizePayments((p) => !p);
                  }}
                />
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default NewGroup;
