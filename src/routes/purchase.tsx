import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import Space from "@/components/ui/space";
import { useState } from "react";

export const Purchase = () => {
  const [key, setKey] = useState(0);

  const handleUpdate = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <DefaultLayout>
      <div className="w-full">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          New Purchase
        </h1>
        <PurchaseForm onSubmitRefresh={handleUpdate} />
        <Space s="h-8" />
        <PurchaseHistory key={key} />
      </div>
    </DefaultLayout>
  );
};
