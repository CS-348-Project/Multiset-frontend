import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import useProfile from "@/context/profile-context";
import { apiService } from "@/utils/api";
import { UserInfo } from "@/types/UserInfo";
import { CopyIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Space from "../ui/space";
import useDetailedGroup from "@/hooks/useDetailedGroup";
import Loading from "../ui/loading";

interface AddMembersCardProps {
  groupId: string;
  existingGroup?: boolean;
  className?: string;
}

export const AddMembersCard = ({
  groupId,
  existingGroup = false,
  className,
}: AddMembersCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, refetchGroups } = useProfile();
  const [email, setEmail] = useState("");
  const [accounts, setAccounts] = useState<UserInfo[]>([]);
  const [existingAccounts, setExistingAccounts] = useState<UserInfo[]>([]);
  const [share_code, setShareCode] = useState("");
  const {
    data,
    isFetching,
    refetch: refetchAccounts,
  } = useDetailedGroup(groupId ?? "");

  useEffect(() => {
    if (data && !isFetching) {
      setShareCode(data.share_code);
      setExistingAccounts(
        data.users.filter((user) => user.email !== profile?.email)
      );
    } else {
      setShareCode("");
    }
  }, [data, isFetching, profile?.email]);

  const handleAddAccount = async () => {
    if (!email) return;
    if (
      accounts.some((user) => user.email == email) ||
      existingAccounts.some((user) => user.email == email) ||
      email === profile?.email
    ) {
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
      if (!existingGroup) {
        toast({
          title: "You must add at least one email",
        });
      }
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
          title: "Members successfully updated",
        });
        setAccounts([]);
        refetchGroups();
        if (existingGroup) {
          refetchAccounts();
          return;
        } else {
          navigate(`/groups/${groupId}`);
        }
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

  if (isFetching) {
    return <Loading className="my-2" />;
  }

  return (
    <Card className={`px-6 ${className} overflow-y-scroll`}>
      <CardHeader>
        <CardTitle>Add Members</CardTitle>
        <CardDescription>
          Add members to your group by email or share the link below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label htmlFor="memberEmails">Shareable Link:</Label>
        <div
          onClick={copyToClipboard}
          className="flex h-auto w-auto rounded-full border border-grey bg-background px-3 py-2 text-sm cursor-pointer opacity-50 gap-3 my-2"
        >
          {share_code ? (
            <>
              {`${window.origin}/join-group/${share_code}`}
              <CopyIcon className="h-5 w-5 ml-auto" />
            </>
          ) : (
            <>Loading...</>
          )}
        </div>
        <Button variant="secondary" onClick={getShareableLink}>
          Copy Shareable Link
        </Button>

        <Space s="h-4" />
        <div>
          <Label htmlFor="memberEmails">Member Emails</Label>
          <div className="flex items-center gap-2 my-2">
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
          <div className="flex items-center justify-center bg-grey rounded-full px-2 py-1 text-sm text-dusk opacity-50">
            {`${profile.email} - ${profile.first_name} ${profile.last_name}`}
          </div>
          {existingAccounts.map((account) => (
            <div
              className="flex items-center justify-center bg-grey rounded-full px-2 py-1 text-sm text-dusk opacity-50"
              key={account.id}
            >
              {`${account.email} - ${account.first_name} ${account.last_name}`}
            </div>
          ))}
          {accounts.map((account, idx) => (
            <div
              className="flex items-center justify-center bg-grey rounded-full px-2 py-1 text-sm text-dusk"
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
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" onClick={addMembersToGroup}>
          Save
        </Button>
        {existingGroup ? null : (
          <Button
            className="w-full"
            onClick={() => navigate(`/groups/${groupId}`)}
            variant="secondary"
          >
            Back to Group
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
