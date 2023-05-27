import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  // @IsNumber()
  // @IsNotEmpty()
  // postId: number
}
