export interface UserDto {
    id: number;
    username: string;
    email: string;
    role: string;
    createdDate: Date;
    updatedDate: Date;
    createdBy: number;
    updatedBy: number;
}