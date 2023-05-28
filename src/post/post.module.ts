import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CommentService } from '../comment/comment.service';

@Module({
  controllers: [PostController],
  providers: [PostService, CommentService]
})
export class PostModule {}
