import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
 @IsNotEmpty({ message: 'User should have an email' })
 @IsEmail({}, { message: 'Please enter a valid email' })
 email: string;
 @IsNotEmpty({ message: 'User should have a password' })
 @MinLength(6)
 password: string;
}