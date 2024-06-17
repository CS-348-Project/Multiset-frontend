export interface TSettlementMemberInfo {
  member_user_id: number;
  member_group_id: number;
  first_name: string;
  last_name: string;
}

export interface TGroupMember {
  id: number;
  email: string;
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
