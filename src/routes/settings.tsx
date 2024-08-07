import DefaultLayout from "@/components/layout/default-layout";
// import { SettingToggle } from "@/components/optimization/SettingToggle";
import { apiService } from "@/utils/api";
import { Group } from "@/types/Group";
import { useEffect, useState } from "react";
import Space from "@/components/ui/space";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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

type SettingsToggleProps = {
  group: Group;
  setGroup: React.Dispatch<React.SetStateAction<Group>>;
};

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  group,
  setGroup,
}) => {
  const handleOptimizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.currentTarget.getAttribute("data-group-id")!);
    const newGroup = {
      ...group,
      optimize_payments: !group.optimize_payments,
    };

    setGroup((p) => ({
      ...p,
      optimize_payments: !group.optimize_payments,
    }));

    // try to toggle the optimization setting
    apiService
      .patch(`/api/optimization/toggle?group_id=${id}`)
      .then(() => {})
      // if it fails, revert the state and show an alert
      .catch((err) => {
        setGroup((p) => ({
          ...p,
          optimize_payments: !group.optimize_payments,
        }));

        setGroup(newGroup);

        console.error(err);
        toast({
          variant: "destructive",
          description: (
            <p>
              Failed to toggle optimization settings. Please try again later.
            </p>
          ),
        });
      });
  };

  return (
    <div className="mr-10">
      {group ? (
        <div key={group.id} className="bg-white shadow-md rounded-lg p-5">
          <h3 className="font-semibold text-black text-lg">{group.name}</h3>
          <div className="flex justify-between items-center mt-5">
            <p className="text-black text-sm md:text-base">Optimize Payments</p>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={group.optimize_payments}
                data-group-id={group.id}
                onChange={handleOptimizationChange}
              />
              <p className="text-black text-sm md:text-base ml-2">
                {group.optimize_payments ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-black text-sm md:text-base mt-5">Loading...</p>
      )}
    </div>
  );
};

const Settings = () => {
  const location = useLocation();
  const [group, setGroup] = useState<Group>({} as Group);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const groupId = pathname[pathname.findIndex((s) => s === "groups") + 1];
    apiService.get(`/api/groups/?group_id=${groupId}`).then((res) => {
      setGroup(res.data);
    });
  }, []);

  const handleDeleteGroup = () => {
    if (group.id) {
      setDeleteDialogOpen(true);
    }
  };

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
    <DefaultLayout>
      <AlertDialog open={deleteDialogOpen}>
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
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteGroup}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Space s="h-4" />
        <p className="text-black text-sm md:text-base">
          You can configure the settings for your groups here. This affects the
          setting for all users in the group.
        </p>
        <p className="text-black text-sm md:text-base font-bold">
          Note: Settings are applied immediately.
        </p>
        <Space s="h-6" />
        <div className="w-full lg:w-1/2">
          <SettingsToggle group={group!} setGroup={setGroup} />
        </div>

        <div className="my-4">
          <Button variant="destructive" onClick={handleDeleteGroup}>
            Delete Group
          </Button>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default Settings;
