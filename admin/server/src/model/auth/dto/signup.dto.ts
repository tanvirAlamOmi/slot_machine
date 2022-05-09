import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SignupDto {

    @IsString()
    username: string;
    
    @IsString()    
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;
    
    @IsString()
    @IsOptional()
    refreshToken: string;
}
