export interface TakeoverBalanceDto {
  id:number;
  checkNumber: string;
  loanNumber: string;
  fspCode: string;
  fSPReferenceNumber: string;
  paymentReferenceNumber: string;
  totalPayoffAmount: number;
  outstandingBalance: number;
  fspBankAccount: string;
  fspBankAccountName: string;
  swiftCode: string;
  mnoChannels: string;
  finalPaymentDate: string;
  lastDeductionDate: string;
  deductionEndDate: string;  

  // request
  firstName: string;
  middleName: string;
  lastName: string;
  voteCode: string;
  voteName: string;
  deductionAmount: number;
  deductionCode: string;
  deductionName: string;
  deductionBalance: number;
  paymentOption: string;
  createdDate: Date; 
}
