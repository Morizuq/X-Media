import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/enum';

@Injectable()
export class LikeService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  //Create Like
  async createLike(postId: number, userId: number) {
    //Fetch post
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });
    //like post
    await this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
    //Send notification
    await this.notificationService.createNotification(
      post.userId,
      NotificationType.LIKES,
      `User ${userId} liked your post`,
    );

    return { message: 'Successfull' };
  }

  //Remove Like
  async removeLike(postId: number, userId: number, likeId: number) {
    const like = await this.prisma.like.findUnique({ where: { id: likeId } });

    if (!like || like.postId !== postId || like.userId !== userId)
      throw new ForbiddenException('Invalid credential');

    await this.prisma.like.delete({
      where: {
        id: likeId,
      },
    });

    return { message: 'Successfull' };
  }
}
