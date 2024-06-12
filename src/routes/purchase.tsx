import DefaultLayout from "@/components/layout/default-layout";
import { PurchaseForm } from "@/components/purchase/PurchaseForm";
import { PurchaseHistory } from "@/components/purchase/PurchaseHistory";
import { apiService } from "@/utils/api";
import { useEffect, useState } from "react";

export const Purchase = () => {
  return (
    <DefaultLayout>
      <div className="mx-10 mb-20">
        <h1 className="font-semibold text-black text-2xl my-10">
          New Purchase
        </h1>
        <PurchaseForm />
        <h1 className="font-semibold text-black text-2xl my-10">
          Purchase History
        </h1>
        <PurchaseHistory />
      </div>
    </DefaultLayout>
  );
};
