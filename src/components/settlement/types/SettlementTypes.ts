export interface TSettlementMemberInfo {
  user_id: number;
  group_id: number;
  first_name: string;
  last_name: string;
}

export interface TSettlement {
  id: number;
  sender: TSettlementMemberInfo;
  amount: number;
  receiver: TSettlementMemberInfo;
  created_at: string;
}

export interface TSettlementCreateDTO {
  sender_user_id: number;
  receiver_user_id: number;
  group_id: number;
  amount: number;
}
