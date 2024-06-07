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
