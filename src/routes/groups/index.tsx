import { GroceryList } from "@/routes/groceryList";
import GroupPage from "./group-id";
import NewGroup from "./new-group";
import { Purchase } from "@/routes/purchase";

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
      path: ":id/grocery-list",
      element: <GroceryList />,
    },
  ],
};

export default groupsRoutes;
