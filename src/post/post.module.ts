import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CommentService } from '../comment/comment.service';
import { NotificationService } from '../notification/notification.service';
import { LikeService } from '../like/like.service';

@Module({
  controllers: [PostController],
  providers: [PostService, CommentService, NotificationService, LikeService]
})
export class PostModule {}
