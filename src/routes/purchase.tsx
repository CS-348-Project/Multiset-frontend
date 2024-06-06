import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/PurchaseForm";

export const Purchase = () => {
  return (
    <DefaultLayout>
      <div className="mx-10">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          New Purchase
        </h1>
        <PurchaseForm />
      </div>
    </DefaultLayout>
  );
};
