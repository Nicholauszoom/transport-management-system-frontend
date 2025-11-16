export interface FinancialDto {
    id: number,
    taxiId: number,
    plateNumber: string,
   recordDate: Date,
   expense: number,
   profit: number,
   expenseNotes: string,
   profitNotes: string,
   driverSubmitted: boolean,
   driverName: string,
   createdAt: Date
}