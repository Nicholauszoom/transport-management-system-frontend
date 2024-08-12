export interface Product{
    id: number;
    productUid: string;
    productCode: string;
    productName: String;
    minimumTenure: string;
    maximumTenure: string;
    minimumPrinciple: number;
    maximumPrinciple: number;
    fspId: number;
    fspCode: string;
    fspName: string;
    productDescription?: string;
    interestRate: number;
    insurance: number;
    currencyName: string; 
    category?: string;
    createdAt?: Date;
    updatedAt?: Date;
    
}