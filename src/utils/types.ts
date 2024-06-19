export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_token: string;
};

export type Group = {
  id: number;
  name: string;
  created_at: Date;
  optimize_payments: boolean;
  budget: number;
};

export type DetailedGroup = Group & {
  users: User[];
};
