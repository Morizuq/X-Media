import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [LikeService, NotificationService]
})
export class LikeModule {}
