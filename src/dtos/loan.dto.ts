export interface LoanDto{
    id: Int32Array;
    loanUid: string;
    loanNumber:string;
    checkNumber:string;
    settlementAmount:number;
    loanAmount: number; 
    loanType: number;
    loanDate:Date;
    fspOneLastDeductionDate:Date;
    fspOneFinalPaymentDate:Date;
    repaymentType:string;
    applicationNumber:string;
    interest:number;
    insurance:number;
    processingFee:number;
    tenure:number;
    deductionCode:string;
    nearestBranchName:string;
    nearestBranchCode:string;
    productCode:string;
    fspCode:string;
    loanPurpose:string;
    bankAccountNumber:string;
    bankAccountName:string;
    deductionName:string;
    deductibleAmount:number;
    fspReferenceNumber:string;
    desiredDeductibleAmount:number;
    requestedAmount:number;
    deductionBalance:number;
    totalAmountToPay:number;
    comment:string;
    swiftCode:string;
    mnoChannels:string;
    paymentReferenceNumber:string;
    borrowerId:number;
    borrower:string;
    loanStatus:string;
   

}