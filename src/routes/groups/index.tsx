import { GroceryList } from "@/routes/groceryList";
import GroupPage from "./group-id";
import NewGroup from "./new-group";
import { Purchase } from "@/routes/purchase";
import { Analytics } from "@/routes/analytics";
import { Logs } from "@/routes/logs";
import { Settlement } from "@/routes/settlement";
import { PurchaseDetails } from "@/components/purchase/PurchaseDetails";
import Settings from "../settings";
import { Optimization } from "../optimization";

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
      path: ":id/logs",
      element: <Logs />,
    },
    {
      path: ":id/grocery-list",
      element: <GroceryList />,
    },
    {
      path: ":id/analytics",
      element: <Analytics />,
    },
    {
      path: ":id/settings",
      element: <Settings />,
    },
    {
      path: ":id/optimization",
      element: <Optimization />,
    },
  ],
};

export default groupsRoutes;
