import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from './enum';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  //Create notification
  async createNotification(
    userId: number,
    type: NotificationType,
    message: string,
  ): Promise<void> {
    await this.prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });
  }

  //Fetch unread notification
  async fetchUnreadNotification(userId: number) {
    return await this.prisma.notification.findMany({
      where: {
        userId,
        read: false,
      },
    });
  }

  //Mark notification as read
  async markNotificationAsRead(userId: number, notificationId: number) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    });

    if (!notification || notification.userId !== userId)
      throw new ForbiddenException('Invalid credentials');

    await this.prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        read: true,
      },
    });

    return { message: 'successfull' };
  }
}
