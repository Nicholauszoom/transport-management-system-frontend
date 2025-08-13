export interface Product{
    id: number;
    productUid: string;
    productCode: string;
    productName: String;
    minimumTenure: string;
    maximumTenure: string;
    minLoanAmount: number;
    maxLoanAmount: number;
    fspId: number;
    fspCode: string;
    fspName: string;
    productDescription?: string;
    interestRate: number;
    insurance: number;
    repaymentType: string;
    currency: string; 
    processFee: number;
    otherCharges:number;
    action: string;
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface DataResponse {
  data: any;
  message?: string;
}

export interface ProductListResponse {
  data: {
    content: Product[];
    totalElements: number;
  };
  message?: string;
}