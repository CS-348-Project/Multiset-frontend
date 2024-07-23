export interface TPurchase {
  id: number;
  name: string;
  category: string;
  group_id: number;
  total_cost: number;
  purchaser: number;
  purchaser_first_name: string;
  purchaser_last_name: string;
  created_at: string;
}

export interface TPurchaseDetails {
  id: number;
  name: string;
  category: string;
  purchaser_group_id: number;
  purchaser_user_id: number;
  purchaser_last_name: string;
  total_cost: number;
  created_at: string;
}
