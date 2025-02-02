import { IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @IsNotEmpty({ message: 'User should have a password' })
    @MinLength(6)
    password: string;
}