import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import Space from "@/components/ui/space";

export const Purchase = () => {
  return (
    <DefaultLayout>
      <div className="w-full px-10 pb-20">
        <h1 className="font-semibold text-black text-2xl my-10">
          New Purchase
        </h1>
        <PurchaseForm />
        <Space s="h-8" />
        <PurchaseHistory />
      </div>
    </DefaultLayout>
  );
};
