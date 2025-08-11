export interface UserDto {
    id: number;
    userName: string;
    email: string;
    role: string;
    createdDate: Date;
    updatedDate: Date;
    createdBy: number;
    updatedBy: number;
}