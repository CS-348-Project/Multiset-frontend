export interface CategoryCount {
  category: string;
  count: number;
}

export interface TopSpender {
  id: number;
  first_name: string;
  last_name: string;
  num_purchases: number;
  total_spend: number;
}
