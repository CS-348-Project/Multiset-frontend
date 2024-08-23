import { GroceryList } from "@/routes/groceryList";
import GroupPage from "./group-id";
import AddMembers from "./add-members";
import { Purchase } from "@/routes/purchase";
import { Analytics } from "@/routes/analytics";
import { Logs } from "@/routes/logs";
import { Settlement } from "@/routes/settlement";
import { PurchaseDetails } from "@/components/purchase/PurchaseDetails";
import Settings from "../settings";
import { EditPurchase } from "@/components/purchase/EditPurchase";
import withAuth from "@/hooks/withAuth";
import { CreateGroup } from "./create-group";

const groupsRoutes = {
  path: "groups",
  children: [
    {
      path: "new",
      element: <CreateGroup />,
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
      path: ":id/purchase/edit/:purchaseId",
      element: <EditPurchase />,
    },
    {
      path: ":id/add-members",
      element: <AddMembers />,
    },
  ].map((route) => ({
    ...route,
    element: withAuth(route.element),
  })),
};

export default groupsRoutes;
