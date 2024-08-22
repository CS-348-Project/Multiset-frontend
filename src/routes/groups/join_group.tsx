import { apiService } from "@/utils/api";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const JoinGroup = () => {
  const params = useParams<{ share_code: string }>();
  const [failed, setFailed] = React.useState(false);
  const [error_message, setErrorMessage] = React.useState("");
  const share_code = params.share_code;
  const navigate = useNavigate();

  useEffect(() => {
    apiService
      .post(`/api/groups/join-by-code?share_code=${share_code}`)
      .then((response) => {
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
          <p className="text-lg">{error_message}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
