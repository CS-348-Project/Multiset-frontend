import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const Purchase = () => {
  const [key, setKey] = useState(0);
  const location = useLocation();
  const { isOpen } = location.state || { isOpen: false };
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);

  const handleUpdate = () => {
    setKey((prev) => prev + 1);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    navigate(location.pathname, { replace: true, state: {} });
  }, [navigate, location.pathname]);

  return (
    <DefaultLayout>
      <h1 className="text-3xl font-bold mb-4">Purchases</h1>
      <Drawer
        open={isDrawerOpen}
        onOpenChange={(e) => {
          setIsDrawerOpen(e);
        }}
      >
        <DrawerTrigger>
          <Button
            variant="primary"
            onClick={() => {
              setIsDrawerOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Purchase
          </Button>
        </DrawerTrigger>
        <DrawerContent className="lg:w-[60vw] lg:mx-auto px-4">
          <DrawerHeader>
            <DrawerTitle>New Purchase</DrawerTitle>
          </DrawerHeader>
          <PurchaseForm
            onSubmitRefresh={handleUpdate}
            className="h-[80vh] overflow-y-scroll"
          />
        </DrawerContent>
        {/* <PurchaseForm onSubmitRefresh={handleUpdate} /> */}
        <PurchaseHistory key={key} />
      </Drawer>{" "}
    </DefaultLayout>
  );
};
