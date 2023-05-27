import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        ...dto,
      },
    });
    return post;
  }

  getAllPosts() {
    return this.prisma.post.findMany();
  }

  getPosts(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId,
      },
    });
  }

  getPost(userId: number, postId: number) {
    return this.prisma.post.findFirst({
      where: {
        id: postId,
        userId,
      },
      include: {
        comments: true,
      },
    });
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access Denied');

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  async updatePost(userId: number, postId: number, dto: EditPostDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post || post.userId !== userId)
      throw new ForbiddenException('Access Denied');

    return await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
      },
    });
  }
}
