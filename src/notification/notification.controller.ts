import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';


@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('/unread')
  getUnreadNotifications(@GetUser('id') userId: number) {
    return this.notificationService.fetchUnreadNotification(userId);
  }

  @Get('/:notificationId')
  markNotificationAsRead(
    @GetUser('id') userId: number,
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ) {
    return this.notificationService.markNotificationAsRead(
      userId,
      notificationId,
    );
  }
}
