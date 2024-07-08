export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

export type Group = {
  id: number;
  name: string;
  created_at: Date;
  optimize_payments: boolean;
};

export type DetailedGroup = Group & {
  users: User[];
};
