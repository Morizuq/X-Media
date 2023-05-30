import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as crypto from 'crypto';

import * as argon from 'argon2';
import { AuthDto, ForgetPasswordDto, ResetPasswordDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { Request } from 'express';
import { Role } from './enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  //Create token
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '2d',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
    };
  }

  //Create Admin
  async createAdmin(dto: AuthDto) {
    try {
      //Hash password
      const hash = await argon.hash(dto.password);
      //Create admin
      const user = await this.prisma.user.create({
        data: {
          hash,
          email: dto.email,
          role: Role.ADMIN,
        },
      });
      //Send welcome email
      await this.mailService.sendWelcome(user);
      //Create and send token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials Taken');

      throw error;
    }
  }

  //Create user
  async signup(dto: AuthDto) {
    try {
      //Hash password
      const hash = await argon.hash(dto.password);
      //Create User
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      //Send welcome mail
      await this.mailService.sendWelcome(user);
      //Create and send token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials Taken');

      throw error;
    }
  }

  //Sign user in
  async signin(dto: AuthDto) {
    //Find user by email
    // console.log({ dto });
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    //If no user is found by email, throw exception
    if (!user) throw new ForbiddenException('Credentials Incorrect');
    //Check if password matches
    const passwordMatches = argon.verify(user.hash, dto.password);
    //If password doesn't match, throw exception
    if (!passwordMatches) throw new ForbiddenException('Credentials Incorrect');

    //Create and send token
    return this.signToken(user.id, user.email);
  }

  //Send Reset password url
  async forgetPassword(dto: ForgetPasswordDto, req: Request) {
    //Find user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    //If user doesn't exist, throw exception
    if (!user) throw new ForbiddenException('User Not Found');

    //Create and encrypt reset token
    const rtoken = crypto.randomBytes(32).toString('hex');
    const resetToken = crypto.createHash('sha256').update(rtoken).digest('hex');

    try {
      //Save reset token to the database
      await this.prisma.user.update({
        where: {
          email: dto.email,
        },

        data: {
          passwordResetToken: resetToken,
        },
      });
      //Send password reset email
      await this.mailService.sendReset(user, resetToken, req);
      //Send response
      return {
        msg: 'Email Sent Successsfully',
      };
    } catch (error) {
      //Throw error if any
      throw error;
    }
  }

  //Reset user password
  async resetPassword(dto: ResetPasswordDto, token: string) {
    try {
      //Encrypt password
      const hash = await argon.hash(dto.password);
      //Find user by reset token
      const user = await this.prisma.user.findFirst({
        where: {
          passwordResetToken: token,
        },
      });
      //If user not found, throw error
      if (!user) throw new ForbiddenException('Invalid Cedentials');
      //Update user password
      await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          hash: hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      //Throw error if any
      throw error;
    }
  }
}
