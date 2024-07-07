import { useParams } from "react-router-dom";

export const PurchaseDetails = () => {
  const params = useParams<{ id: string }>();
  const group_id = Number(params.id);

  return (
    <div>
      <h1>{group_id}</h1>
    </div>
  );
};
