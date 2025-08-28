export interface TakeoverPaymentDto {
  // payment
  id: number;
  applicationNumber: string;
  loanNumber: string;
  takeoverBalanceId: number;
  reason: string;
  fspReferenceNumber: string;
  paymentReferenceNumber: string;
  totalPayoffAmount: number;
  paymentDate: string;
  paymentAdvice: string;
  paymentAdviceAttachment: string;
  createdDate: Date;
  requestType: string;
  // Balance fields

  balanceCheckNumber: string;
  balanceLoanNumber: string;
  balanceFspCode: string;
  balanceFSPReferenceNumber: string;
  balancePaymentReferenceNumber: string;
  balanceTotalPayoffAmount: number;
  balanceOutstandingBalance: number;
  balanceFspBankAccount: string;
  balanceFspBankAccountName: string;
  balanceSwiftCode: string;
  balanceMnoChannels: string;
  balanceFinalPaymentDate: string;
  balanceLastDeductionDate: string;
  balanceDeductionEndDate: string;
  balanceFirstName: string;
  balanceMiddleName: string;
  balanceLastName: string;
  balanceVoteCode: string;
  balanceVoteName: string;
  balanceDeductionAmount: number;
  balanceDeductionCode: string;
  balanceDeductionName: string;
  balanceDeductionBalance: number;
  balancePaymentOption: string;
  balanceCreatedDate: Date;
}
