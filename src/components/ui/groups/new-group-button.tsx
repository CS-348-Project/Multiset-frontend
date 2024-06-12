import { PlusIcon } from "lucide-react";
import { Button } from "../button";
import { Link } from "react-router-dom";

const NewGroupButton = () => {
  return (
    <Link to="/groups/new">
      <Button
        variant="outline"
        className="w-full h-full flex flex-col font-normal text-creme/80"
      >
        <PlusIcon className="h-16 w-16" />
      </Button>
    </Link>
  );
};

export default NewGroupButton;
