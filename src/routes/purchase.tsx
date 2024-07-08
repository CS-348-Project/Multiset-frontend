import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";

export const Purchase = () => {
  return (
    <DefaultLayout>
      <div className="mx-10 mb-20">
        <h1 className="font-semibold text-black text-2xl my-10">
          New Purchase
        </h1>
        <PurchaseForm />
      </div>
    </DefaultLayout>
  );
};
