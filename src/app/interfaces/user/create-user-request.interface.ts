export interface ICreateUserRequest {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    birthDate: Date;
    activated: boolean;
    roles: number[];
    workingHotelId: number;
}