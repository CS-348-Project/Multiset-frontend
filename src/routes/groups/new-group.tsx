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
import { apiService } from "@/utils/api";
import { User } from "@/utils/types";
import { CornerUpLeftIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewGroup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<User[]>([]);

  const handleAddAccount = () => {
    if (!email) return;

    apiService
      .get<User[]>(`/api/users/?email=${email}`)
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

  const createGroup = () => {
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
        group: {
          name: groupName,
          optimize_payments: false,
          budget: null,
        },
        user_ids: accounts.map((account) => account.id),
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

        navigate(`/groups/${groupId}`);
      })
      .catch((error) => {
        toast({
          title: error.response.statusText,
        });
      });
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <div className="absolute left-4 top-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <CornerUpLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
      </div>
      <Card className="w-full max-w-lg bg-dusk drop-shadow-md">
        <Tabs defaultValue="create" className="text-creme">
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
                      <XIcon className="h-4 w-4" />
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
            <CardContent>Bonk</CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default NewGroup;
