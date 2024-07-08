import { DetailedGroup } from "@/utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { UsersIcon } from "lucide-react";
import { Button } from "../ui/button";

const GroupCard = ({ group }: { group: DetailedGroup }) => {
  const splitName = group.name.split(" ");
  const parsedName = `${splitName[0]}${
    splitName.length > 1 ? "+" + splitName[1] : ""
  }`;

  console.log(parsedName);

  return (
    <Card className="w-full h-full flex flex-col aspect-[5/4]">
      <CardContent className="w-full h-full flex flex-col justify-end">
        {/* Horizontal Line */}
        <div className="w-full h-[1px] bg-dusk my-2" />

        <div className="flex items-center justify-between">
          <CardTitle>{group.name}</CardTitle>

          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            <span>{group.users.length}</span>
          </div>
        </div>

        <div className="mt-4 w-full">
          <a href={`/groups/${group.id}`}>
            <Button className="w-full">View Group</Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;