import { DetailedGroup } from "@/types/Group";
import { Card, CardContent, CardTitle } from "../ui/card";
import { UsersIcon } from "lucide-react";
import { Button } from "../ui/button";

const GroupCard = ({ group }: { group: DetailedGroup }) => {
  return (
    <a href={`/groups/${group.id}`}>
      <Card className="w-full h-full flex flex-col py-4 rounded-3xl">
        <CardContent className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{group.name}</CardTitle>

            <div className="flex items-center gap-1">
              <UsersIcon className="w-5 h-5" />
              <span>{group.users.length}</span>
            </div>
          </div>

          <div className="mt-4 w-full">
            <Button className="w-full" variant="secondary">
              View Group
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
};

export default GroupCard;
