export interface ChargeDto{
  checkNumber?: string;
  designationCode?: string;
  designationName?: string;
  basicSalary?: number;
  netSalary?: number;
  oneThirdAmount?: number;
  requestedAmount?: number;
  deductibleAmount?: number;
  desiredDeductibleAmount?: number;
  retirementDate?: number;
  termsOfEmployment?: string;
  tenure?: number; 
  productCode?: string;
  voteCode?: string;
  totalEmployeeDeduction?: number;
  jobClassCode?: string;
  createdDate?: Date;

  totalInsurance:number;
  totalProcessingFee:number;
  totalInterestRateAmount:number;
  otherCharges:number;
  netLoanAmount:number;
  totalAmountToPay:number;
  eligibleAmount: number;
  monthlyReturnAmount: number;
  responseTenure: number;
  insuranceProcessFee:number;
  takeHomeAmount: number;
}