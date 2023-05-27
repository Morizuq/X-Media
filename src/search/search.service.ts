import { Injectable } from '@nestjs/common';
import { SearchPostDto, SearchUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchUsers(dto: SearchUserDto) {
    return await this.prisma.user.findMany({
      where: {
        ...dto,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
      },
    });
  }

  async searchPosts(dto: SearchPostDto) {
    return await this.prisma.post.findMany({
      where: {
        title: dto.title,
      },
      select: {
        title: true,
        content: true,
        link: true,
      },
    });
  }
}
