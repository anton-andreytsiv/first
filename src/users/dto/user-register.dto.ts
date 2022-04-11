import { IsEmail, IsString } from "class-validator";

export class UserRegisterDto {

    @IsEmail({ message: "not email" })
    email: string;

    @IsString({ message: "not email" })
    password: string;

    @IsString({ message: "not email" })
    name: string;
}