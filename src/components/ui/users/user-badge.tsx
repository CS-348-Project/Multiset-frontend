import useUser from "@/hooks/useUser";
import { Skeleton } from "../skeleton";
import { UserInfo } from "@/types/UserInfo"

type UserBadgeProps = {
  id?: number;
  user?: UserInfo;
};

const UserBadgeDisplay = ({ user }: { user: UserInfo }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=000&color=fff`}
          alt="avatar"
          className="h-8 w-8 rounded-full"
        />
        <div>
          <h3 className="text-lg font-medium">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-dusk">{user.email}</p>
        </div>
      </div>
      <div className="text-right">
        {
          user.balance && user.balance > 0 ? (
            <span className="text-lg font-medium">+${user.balance.toFixed(2)}</span>
          ) : (
            <span className="text-lg font-medium text-red-500">-${Math.abs(user.balance ?? 0).toFixed(2)}</span>
          )
        }
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
