export interface TSettlementMemberInfo {
  id: number;
  email: number;
  first_name: string;
  last_name: string;
}

export interface TSettlement {
  id: number;
  sender: TSettlementMemberInfo;
  amount: number;
  receiver: TSettlementMemberInfo;
  created_at: Date;
}

export interface TSettlementCreateDTO {
  sender_user_id: number;
  receiver_user_id: number;
  group_id: number;
  amount: number;
}
