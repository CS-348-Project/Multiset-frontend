export interface TSettlementMemberInfo {
  memberId: number;
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
  sender_id: number;
  receiver_id: number;
  amount: number;
}
