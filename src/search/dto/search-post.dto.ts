import { IsNotEmpty, IsString } from 'class-validator';

export class SearchPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
