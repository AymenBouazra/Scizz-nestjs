import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
 @IsNotEmpty({ message: 'User should have a firstname' })
 firstname: string;
 @IsNotEmpty({ message: 'User should have a lastname' })
 lastname: string;
 @IsNotEmpty({ message: 'User should have an email' })
 @IsEmail({}, { message: 'Please enter a valid email' })
 email: string;
 @IsNotEmpty({ message: 'User should have a password' })
 @MinLength(6)
 password: string;
}