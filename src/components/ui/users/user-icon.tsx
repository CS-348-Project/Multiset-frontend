type UserIconProps = {
  first_name?: string;
  last_name?: string;
};

const UserIcon = ({ first_name, last_name }: UserIconProps) => {
  return (
    <img
      src={`https://ui-avatars.com/api/?name=${first_name}+${last_name}&background=489BFC&color=fff`}
      width="32"
      height="32"
      className="rounded-full"
      alt="Avatar"
    />
  );
};

export default UserIcon;
