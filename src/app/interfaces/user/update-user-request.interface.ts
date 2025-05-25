export interface IUpdateUserRequest {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: Date;
    activated: boolean;
    roles: number[];
    workingHotelId: number;
}