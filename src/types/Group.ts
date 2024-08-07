import { UserInfo } from "./UserInfo";

export interface Group {
  id: number;
  name: string;
  optimize_payments: boolean;
  created_at: string;
}

export interface DetailedGroup extends Group {
  users: UserInfo[];
}
