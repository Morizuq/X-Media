import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { NotificationService } from '../notification/notification.service';

@Module({
  providers: [CommentService, NotificationService],
  controllers: [CommentController]
})
export class CommentModule {}
