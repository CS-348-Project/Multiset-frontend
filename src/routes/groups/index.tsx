import { GroceryList } from "@/routes/groceryList";
import GroupPage from "./group-id";
import NewGroup from "./new-group";
import { Purchase } from "@/routes/purchase";
import { Settlement } from "@/routes/settlement";
import { PurchaseDetails } from "@/components/purchase/PurchaseDetails";

const groupsRoutes = {
  path: "groups",
  children: [
    {
      path: "new",
      element: <NewGroup />,
    },
    {
      path: ":id",
      element: <GroupPage />,
    },
    {
      path: ":id/purchase",
      element: <Purchase />,
    },
    {
      path: ":id/purchase/:purchaseId",
      element: <PurchaseDetails />,
    },
    {
      path: ":id/settlement",
      element: <Settlement />,
    },
    {
      path: ":id/grocery-list",
      element: <GroceryList />,
    },
    {
      path: ":id/settlement",
      element: <Settlement />,
    },
  ],
};

export default groupsRoutes;
