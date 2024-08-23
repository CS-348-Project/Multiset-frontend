import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusIcon } from "lucide-react";

export const Purchase = () => {
  return (
    <DefaultLayout>
      <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl">
        Purchases
      </h1>
      <Drawer>
        <DrawerTrigger>
          <Button variant="primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Purchase
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
        {/* <PurchaseForm onSubmitRefresh={handleUpdate} />
        <Space s="h-8" />
        <PurchaseHistory key={key} /> */}
      </Drawer>{" "}
    </DefaultLayout>
  );
};
