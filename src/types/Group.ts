import { UserInfo } from "./UserInfo";

export interface Group {
  id: number;
  name: string;
  optimize_payments: boolean;
  created_at: string;
  share_code: string;
}

export interface DetailedGroup extends Group {
  users: UserInfo[];
}
