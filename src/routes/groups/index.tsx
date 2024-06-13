import GroupPage from "./group-id";
import NewGroup from "./new-group";

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
  ],
};

export default groupsRoutes;
