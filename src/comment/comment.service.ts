import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  //Create comment
  async createComment(postId: number, userId: number, dto: CommentDto) {
    return await this.prisma.comment.create({
      data: {
        userId,
        postId,
        content: dto.content,
      },
    });
  }

  //Get all comment for a post
  async getAllPostComments(postId: number) {
    return await this.prisma.comment.findMany({
      where: {
        postId,
      },
    });
  }

  //Get all user comments
  async getAllUserComments(userId) {
    return await this.prisma.comment.findMany({
      where: {
        userId,
      },
    });
  }

  //Get all comments for a user under a particular post
  async getUserComments(userId: number, postId: number) {
    return await this.prisma.comment.findMany({
      where: {
        userId,
        postId,
      },
    });
  }

  //Get single comment by Id
  async getComment(postId: number, commentId: number) {
    return await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
      },
    });
  }

  //Delete comment for a particular post and user
  async deleteComment(userId: number, postId: number, commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment || comment.userId !== userId || comment.postId !== postId)
      throw new ForbiddenException('Access Denied');

    return await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  //Update comment for a particular post and user
  async updateComment(
    postId: number,
    userId: number,
    commentId: number,
    dto: CommentDto,
  ) {
    //Find comment
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    //If comment not found, throw exception
    if (!comment || comment.postId !== postId || comment.userId !== userId)
      throw new ForbiddenException('Comment not found');
    //Update comment
    return await this.prisma.comment.update({
      where: {
        id: commentId,
      },

      data: {
        ...dto,
      },
    });
  }
}
