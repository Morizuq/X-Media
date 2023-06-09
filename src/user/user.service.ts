import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditDto } from './dto/edit.dto';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/enum';
import { Role } from '../auth/enum';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async updateuser(userId: number, dto: EditDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }

  /****Follow User****
  Here, the followerId is the current logged in user Id while

  the followingId is the Id of the user that is to be followed
  */
  async followUser(followingId: number, followerId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: followingId,
      },
    });

    if (!user) throw new ForbiddenException('Invalid Credentials');

    try {
      await this.prisma.follows.create({
        data: {
          follower: {
            connect: {
              id: followerId,
            },
          },
          following: {
            connect: {
              id: followingId,
            },
          },
        },
      });
    } catch (error) {
      throw new Error('Failed to follow user');
    }

    await this.notificationService.createNotification(
      followerId,
      NotificationType.FOLLOW,
      `User ${followerId} followed you`,
    );

    return {
      message: `Followed user ${user.id}`,
    };
  }

  //Unfollow user
  async unfollowUser(followingId: number, followerId: number) {
    const follow = await this.prisma.follows.findFirst({
      where: {
        followerId,
        followingId,
      },
    });

    if (!follow) throw new ForbiddenException('Follow relationship not found');

    try {
      await this.prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId,
          },
        },
      });
    } catch (error) {
      throw new Error('Could not unfollow user');
    }

    return {
      message: `Unfollowed user ${followingId}`,
    };
  }

  //Make a user admin => Can only be used by super users
  async makeAdmin(userId: number) {
    //Find if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    //If user doesn't exist, throw exception
    if (!user) throw new ForbiddenException('Invalid Credentials');

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: Role.ADMIN,
      },
    });

    return { message: 'successful' };
  }

  //Make an admin user => can only be used by super users
  async makeUser(userId: number) {
    //Find if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    //If user doesn't exist, throw exception
    if (!user) throw new ForbiddenException('Invalid Credentials');

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: Role.USER,
      },
    });

    return { message: 'successful' };
  }
}
