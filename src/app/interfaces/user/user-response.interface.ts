import { IRole } from "./role.interface";

export interface IUserResponse {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: string;
    createdAt: Date;
    activated: boolean;
    roles: IRole[];
    workingHotelId: number;
}