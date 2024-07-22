import useUser from "@/hooks/useUser";
import { Skeleton } from "../skeleton";
import { User } from "@/utils/types";

type UserBadgeProps = {
  id?: number;
  user?: User;
};

const UserBadgeDisplay = ({ user }: { user: User }) => {
  return (
    <div className="w-full flex items-center justify-between gap-4">
      <img
        src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=000&color=fff`}
        alt="avatar"
        className="h-8 w-8 rounded-full"
      />
      <div className="flex-shrink overflow-hidden">
        <h3 className="text-lg font-medium text-ellipsis overflow-hidden">
          {user.first_name} {user.last_name}
        </h3>
        <p className="text-dusk text-ellipsis overflow-hidden">{user.email}</p>
      </div>
      <div className="text-right">
        <span className="text-lg font-medium text-red-500">-$25.00</span>
      </div>
    </div>
  );
};

const UserBadgeLazy = ({ id }: { id: number }) => {
  const { data, isLoading } = useUser(id);

  if (isLoading || !data) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return <UserBadgeDisplay user={data} />;
};

const UserBadge = ({ id, user }: UserBadgeProps) => {
  if (user) return <UserBadgeDisplay user={user} />;
  if (id) return <UserBadgeLazy id={id} />;
  throw new Error("UserBadge requires either an id or user property");
};

export default UserBadge;
