export interface MandateDto {
     id: number;
     checksum: string;
     partnerId: string;
     phoneNumber: string;
     debitAccount: string;
     totalAmount: number;
     installmentAmount: number;
     startDate: string;
     endDate: string;
     frequencyType: string;
     frequency: number;
     billDetails: string;
     mandateRequestType: string;
     createdDate: Date;

     // Fields for response handling
     statusCode: string;
     responseDescription: string;
     errorCode: string;
     errorMessage: string;
     submittedDate: string;
     
}