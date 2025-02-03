import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'Original URL cannot be empty' })
  @IsString()
  @IsUrl({ }, { message: 'Must be a valid URL, eg: https://www.example.com' })
  originalUrl: string;
  token: string | null;
}