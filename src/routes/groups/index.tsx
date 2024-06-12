import NewGroup from "./new-group";

const groupsRoutes = {
  path: "groups",
  children: [
    {
      path: "new",
      element: <NewGroup />,
    },
  ],
};

export default groupsRoutes;
