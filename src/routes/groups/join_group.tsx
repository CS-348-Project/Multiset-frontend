import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/utils/api";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const JoinGroup = () => {
  const params = useParams<{ share_code: string }>();
  const [failed, setFailed] = React.useState(false);
  const [error_message, setErrorMessage] = React.useState("");
  const share_code = params.share_code;
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    apiService
      .post(`/api/groups/join-by-code?share_code=${share_code}`)
      .then((response) => {
        toast({
          title: "Group joined successfully",
          variant: "success",
        });
        navigate(`/groups/${response.data.group_id}`);
      })
      .catch((error) => {
        setFailed(true);
        setErrorMessage(error.response.data.detail);
      });
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {failed ? (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold">Failed to join group</h1>
          <p className="text-lg">
            Make sure that you are logged in and that the url is correct
          </p>
          <Button
            className="my-5"
            onClick={() => {
              navigate("/");
            }}
          >
            Log In
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
