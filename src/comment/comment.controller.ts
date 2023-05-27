import { Controller, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetUser } from '../auth/decorator';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get()
  getAllUserComment(@GetUser('id') userId: number) {
    return this.commentService.getAllUserComments(userId);
  }
}
