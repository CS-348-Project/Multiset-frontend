export interface TLog {
  id: number;
  member_group_id: number;
  member_user_id: number;
  action: string;
  details: string;
  created_at: Date;
}
