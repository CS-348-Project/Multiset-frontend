import React from "react";
import DefaultLayout from "../layout/default-layout";
import { PurchaseForm } from "./PurchaseForm";
import { useParams } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

export const EditPurchase = () => {
  const params = useParams<{ purchaseId: string }>();
  const purchase_id = Number(params.purchaseId);
  return (
    <DefaultLayout>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => window.history.back()}
      >
        <ArrowLeftIcon className="w-6 h-6" />
        <p className="text-black">Back to Purchase Details</p>
      </div>
      <h1 className="font-semibold text-black text-2xl my-5">Edit Purchase</h1>
      <PurchaseForm purchase_id={purchase_id} />
    </DefaultLayout>
  );
};
