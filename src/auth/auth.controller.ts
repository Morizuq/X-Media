import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { AuthDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  singup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Post('/forget-password')
  forgetPassword(@Body() dto: ForgetPasswordDto, @Req() req: Request) {
    return this.authService.forgetPassword(dto, req);
  }

  @Post('reset-password/:token')
  resetPassword(@Body() dto: ResetPasswordDto, @Param('token') rtoken: string) {
    return this.authService.resetPassword(dto, rtoken);
  }
}
