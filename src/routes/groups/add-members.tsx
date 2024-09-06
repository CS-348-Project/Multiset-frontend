import { AddMembersCard } from "@/components/groups/AddMembersCard";
import { Button } from "@/components/ui/button";
import { CornerUpLeftIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const AddMembers = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  if (!id) {
    navigate("/home");
    return null;
  }

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-grey">
      <div className="absolute left-4 top-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <CornerUpLeftIcon className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
      </div>
      <AddMembersCard
        groupId={id}
        className="w-lg max-w-full bg-white drop-shadow-md rounded-lg py-6"
      />
    </div>
  );
};

export default AddMembers;
