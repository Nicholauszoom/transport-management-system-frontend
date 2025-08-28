export interface BalanceDto {
  id: number;
  checkNumber: string;
  loanNumber: string;
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
  requestType: string;

  // response
  fSPReferenceNumber: string;
  paymentReferenceNumber: string;
  totalPayoffAmount: number;  
  outstandingBalance: number;
  finalPaymentDate: string;
  lastDeductionDate: string;
  lastPayDate: string;
  endDate: string;
}
