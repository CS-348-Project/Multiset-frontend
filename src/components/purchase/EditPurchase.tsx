import React from "react";
import DefaultLayout from "../layout/default-layout";
import { PurchaseForm } from "./PurchaseForm";
import { useParams } from "react-router-dom";

export const EditPurchase = () => {
  const params = useParams<{ purchaseId: string }>();
  const purchase_id = Number(params.purchaseId);
  return (
    <DefaultLayout>
      <h1 className="font-semibold text-black text-2xl my-5">Edit Purchase</h1>
      <PurchaseForm purchase_id={purchase_id} />
    </DefaultLayout>
  );
};
