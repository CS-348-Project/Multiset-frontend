import DefaultLayout from "@/components/layout/default-layout";
import { SettlementForm } from "@/components/settlement/SettlementForm";
import { SettlementHistory } from "@/components/settlement/SettlementHistory";

export const Settlement = () => {
  return (
    <DefaultLayout>
      <div className="mx-10">
        <h1 className="font-semibold text-black text-2xl md:text-3xl lg:text-4xl my-10">
          Settlements
        </h1>
        <SettlementForm />
        <SettlementHistory />
      </div>
    </DefaultLayout>
  );
};
