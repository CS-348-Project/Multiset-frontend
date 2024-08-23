import { useEffect, useState } from "react";
import { apiService } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Group } from "@/types/Group";
import { Button } from "@/components/ui/button";

type MembersDialog = {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
};

const MembersDialog: React.FC<MembersDialog> = ({ isOpen, onClose, group }) => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    apiService
      .get(`/api/groups/?group_id=${group_id}&detailed=true`)
      .then((res) => {
        setMembers(res.data["users"]);
      });
  }, []);

  const deleteMember = (id: number) => {
    console.log(id);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Members:</AlertDialogTitle>
          {members.length > 0 ? (
            members.map((member) => (
              <div className="flex">
                <p key={member["id"]}>
                  {member["first_name"]} {member["last_name"]}
                </p>
                <Button
                  variant="destructive"
                  onClick={() => deleteMember(member["id"])}
                >
                  Delete
                </Button>
              </div>
            ))
          ) : (
            <p>No members available</p>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          {/* <AlertDialogAction onClick={deleteGroup}>Delete</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MembersDialog;
