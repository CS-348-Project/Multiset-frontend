import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultLayout from "@/components/layout/default-layout";
import { apiService } from "@/utils/api";
import { Group } from "@/types/Group";
import Space from "@/components/ui/space";
import { Button } from "@/components/ui/button";
import SettingsToggle from "@/components/settings/settingsToggle";
import DeleteGroupDialog from "@/components/dialogs/deleteGroupDialog";
import MembersDialog from "@/components/dialogs/membersDialog";

const Settings = () => {
  const location = useLocation();
  const [group, setGroup] = useState<Group>({} as Group);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const groupId = pathname[pathname.findIndex((s) => s === "groups") + 1];
    apiService.get(`/api/groups/?group_id=${groupId}`).then((res) => {
      setGroup(res.data);
    });
  }, [location]);

  const handleDeleteGroup = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <DefaultLayout>
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
          <SettingsToggle group={group} setGroup={setGroup} />
        </div>

        <div className="my-4">
          <Button className="mr-4" onClick={() => setMembersDialogOpen(true)}>
            Members
          </Button>
          <Button variant="destructive" onClick={handleDeleteGroup}>
            Delete Group
          </Button>
        </div>
      </div>
      <DeleteGroupDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        group={group}
      />
      <MembersDialog
        isOpen={membersDialogOpen}
        onClose={() => setMembersDialogOpen(false)}
        group={group}
      />
    </DefaultLayout>
  );
};

export default Settings;
