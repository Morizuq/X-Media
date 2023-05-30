import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

import { EditDto } from './dto/edit.dto';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch("update-me")
  updateUser(@GetUser('id') userId: number, @Body() dto: EditDto) {
    return this.userService.updateuser(userId, dto);
  }

  @Post('/follow/:followingId')
  followUser(
    @GetUser('id') followerId: number,
    @Param('followingId', ParseIntPipe) followingId: number,
  ) {
    return this.userService.followUser(followingId, followerId);
  }

  @Post('/unfollow/:followingId')
  unfollowUser(
    @GetUser('id') followerID: number,
    @Param('followingId', ParseIntPipe) followingId: number,
  ) {
    return this.userService.unfollowUser(followingId, followerID);
  }
}
