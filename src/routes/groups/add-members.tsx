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
import { useToast } from "@/components/ui/use-toast";
import useProfile from "@/context/profile-context";
import { apiService } from "@/utils/api";
import { UserInfo } from "@/types/UserInfo";
import { CornerUpLeftIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddMembers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, refetchGroups } = useProfile();
  const params = useParams<{ id: string }>();
  const groupId = Number(params.id);
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<UserInfo[]>([]);
  const [share_code, setShareCode] = useState("");

  useEffect(() => {
    apiService
      .get(`/api/groups/share_code?group_id=${groupId}`)
      .then((response) => {
        setShareCode(response.data.share_code);
      });
  }, []);

  const handleAddAccount = async () => {
    if (!email) return;
    if (accounts.some((user) => user.email == email)) {
      toast({
        title: "User already in group",
      });
      return;
    }

    apiService
      .get<UserInfo[]>(`/api/users/get?email=${email}`)
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

  const addMembersToGroup = async () => {
    const groupAccounts = [...accounts];
    if (accounts.length === 0) {
      toast({
        title: "You must add at least one email",
      });
      return;
    }
    for (const account of groupAccounts) {
      if (account.email === profile?.email) {
        toast({
          title: "You cannot add yourself to the group",
        });
        return;
      }
    }

    if (email !== "") {
      if (accounts.some((user) => user.email == email)) {
        return;
      }
      try {
        await apiService
          .get<UserInfo[]>(`/api/users/get?email=${email}`)
          .then((response) => {
            if (response.data.length !== 0) {
              groupAccounts.push(response.data[0]);
            }
          });
      } catch (error) {
        // do nothing
      }
    }
    const user_ids = groupAccounts.map((account) => account.id);
    apiService
      .post("/api/groups/add_members", {
        group_id: groupId,
        user_ids,
      })
      .then(() => {
        toast({
          title: "Member successfully added",
        });
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

  const getShareableLink = async () => {
    try {
      const shareableLink = `${window.location.origin}/join-group/${share_code}`;
      navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Shareable link copied to clipboard!",
      });
    } catch (error) {
      console.error("Failed to copy link: ", error);
      toast({
        title: "Failed to copy link",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      navigator.clipboard.writeText(
        `${window.origin}/join-group/${share_code}`
      );
      toast({
        title: "Copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Failed to copy text",
      });
    }
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
        <CardHeader className="space-y-1.5">
          <CardTitle>Add Members</CardTitle>
          <CardDescription>
            Enter a group name and add member emails to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="memberEmails">Shareable Link:</Label>
          <div>
            {share_code ? (
              <span
                onClick={copyToClipboard}
                style={{
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {`${window.origin}/join-group/${share_code}`}
              </span>
            ) : (
              "Loading..."
            )}
          </div>
          <Button className="" onClick={getShareableLink}>
            Copy Shareable Link
          </Button>

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
              <Button variant="ghost" size="icon" onClick={handleAddAccount}>
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
                  {<XIcon className="h-4 w-4" />}
                  <span className="sr-only">Remove email</span>
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={addMembersToGroup}>
            Add
          </Button>
          <Button
            className="w-full"
            onClick={() => navigate(`/groups/${groupId}`)}
          >
            Back to Group
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMembers;
