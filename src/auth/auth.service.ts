import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import * as argon from 'argon2';
import { AuthDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
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

  //Create user
  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      //Create and send token
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException('Credentials Taken');

      throw error;
    }
  }

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
}
