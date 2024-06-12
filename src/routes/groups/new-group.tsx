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
import { apiService } from "@/utils/api";
import { User } from "@/utils/types";
import { CornerUpLeftIcon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";

const NewGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<User[]>([]);

  const handleAddAccount = async (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (email) {
        const user = await apiService.get(`/users?email=${email}`);

        setAccounts([...accounts, user]);
        setEmail("");
      }
      e.currentTarget.value = "";
    }
  };

  const createGroup = () => {
    apiService.post("/groups/create", {
      group: {
        name: groupName,
        optimize_payments: false,
        budget: 0,
      },
      users: accounts,
    });
  };

  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <div className="absolute left-4 top-4">
        <Button variant="ghost" size="icon">
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
                    onKeyDown={handleAddAccount}
                  />
                  <Button variant="ghost" size="icon">
                    <PlusIcon className="h-5 w-5" />
                    <span className="sr-only">Add email</span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {accounts.map((account) => (
                  <div className="flex items-center justify-center bg-creme px-3 py-1 rounded-md text-sm text-dusk">
                    {account}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-fit w-fit text-dusk hover:text-lilac hover:bg-transparent "
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
