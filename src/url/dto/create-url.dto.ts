import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'Original URL cannot be empty' })
  @IsString()
  @IsUrl({ require_protocol: true }, { message: 'Must be a valid URL with protocol' })
  originalUrl: string;
  @IsString()
  token: string;
}