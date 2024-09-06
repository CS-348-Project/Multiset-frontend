import DefaultLayout from "@/components/layout/default-layout";
import LoadingPage from "@/components/layout/loading-page";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import Space from "@/components/ui/space";
import useDetailedGroup from "@/hooks/useDetailedGroup";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { PlusIcon, SettingsIcon, UsersIcon } from "lucide-react";
import { OptimalPaymentTable } from "@/components/settlement/OptimalPaymentTable";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useState } from "react";
import { AddMembersCard } from "@/components/groups/AddMembersCard";

const GroupPage = () => {
  const navigate = useNavigate();
  const [manageGroupOpen, setManageGroupOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useDetailedGroup(id ?? "");

  if (!id) {
    navigate("/home");
    return null;
  }

  if (isLoading || !data) {
    return <LoadingPage />;
  }

  return (
    <DefaultLayout>
      <div className="w-full flex justify-between gap-2">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <div className="flex items-start gap-1 mt-2">
          <UsersIcon className="w-5 h-5" />
          <span>{data.users.length}</span>
        </div>
      </div>

      <Space s="h-4" />
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="primary"
          onClick={() =>
            navigate(`/groups/${id}/purchase`, {
              replace: true,
              state: { isOpen: true },
            })
          }
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Purchase
        </Button>
        <Button variant="secondary" onClick={() => setManageGroupOpen(true)}>
          <SettingsIcon className="w-4 h-4 mr-2" />
          Manage Group
        </Button>
      </div>

      <Space s="h-4" />

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="bg-grey text-black rounded-3xl p-4 w-full">
          <OptimalPaymentTable userOwes={true} />
        </div>
        <div className="bg-grey text-black rounded-3xl p-4 w-full">
          <OptimalPaymentTable userOwes={false} />
        </div>
      </div>
      <PurchaseHistory />

      <Drawer
        open={manageGroupOpen}
        onOpenChange={(open) => setManageGroupOpen(open)}
      >
        <DrawerContent className="lg:w-[60vw] lg:mx-auto max-h-full mt-2 px-4">
          <DrawerHeader>
            <DrawerTitle>Manage Group</DrawerTitle>
            <DrawerDescription hidden>Manage Group Members</DrawerDescription>
          </DrawerHeader>
          <AddMembersCard existingGroup groupId={id} />
          <DrawerFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setManageGroupOpen(false);
              }}
            >
              Back
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </DefaultLayout>
  );
};

export default GroupPage;
