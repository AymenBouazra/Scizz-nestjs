import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty({ message: 'Firstname cannot be empty' })
  @IsString()
  firstname: string;

  @IsNotEmpty({ message: 'Lastname cannot be empty' })
  @IsString()
  lastname: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 6 characters long' })
  password: string;
}
