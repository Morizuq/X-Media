import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SearchUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  firstName?: string;
  @IsString()
  @IsOptional()
  lastName?: string;
}
