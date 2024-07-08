import { TSettlementMemberInfo } from "@/components/settlement/types/SettlementTypes";

export interface TGroceryList {
  id: number;
  name: string;
  group_id: number;
  created_at: string;
}

export interface TGroceryListCreateDTO {
  name: string;
  group_id: number;
}

export interface TGroceryListItem {
  id: number;
  item_name: string;
  quantity: number;
  grocery_list_id: number;
  member: TSettlementMemberInfo;
  notes: string;
  completed: boolean;
}
