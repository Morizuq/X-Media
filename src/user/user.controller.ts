import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

import { EditDto } from './dto/edit.dto';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  updateUser(@GetUser('id') userId: number, @Body() dto: EditDto) {
    return this.userService.updateuser(userId, dto);
  }
}
