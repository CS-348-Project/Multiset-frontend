import React from "react";
import { apiService } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
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

type DeleteGroupDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
};

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  isOpen,
  onClose,
  group,
}) => {
  const navigate = useNavigate();

  const deleteGroup = () => {
    if (group.id) {
      apiService
        .delete(`/api/groups/delete?group_id=${group.id}`)
        .then(() => {
          toast({
            variant: "success",
            description: <p>Group successfully deleted.</p>,
          });
          navigate("/home");
        })
        .catch((err) => {
          console.error(err);
          toast({
            variant: "destructive",
            description: <p>Failed to delete group. Please try again later.</p>,
          });
        });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this group?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            group and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteGroup}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGroupDialog;
