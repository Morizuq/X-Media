import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcome(user: User) {
    // console.log({user})
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome',
      template: './welcome',
      // context: {
      //   firstname: user.firstName,
      // },
    });
  }

  async sendReset(user: User, resetToken: string, request: Request) {
    const url = `${request.protocol}://${request.get(
      'host',
    )}/auth/reset-password/${resetToken}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      template: './passwordReset',
      context: {
        url,
      },
    });
  }
}
