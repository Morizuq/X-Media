import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { CommentModule } from './comment/comment.module';
import { SearchModule } from './search/search.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    PostModule,
    MailModule,
    CommentModule,
    SearchModule,
    NotificationModule,
  ],
})
export class AppModule {}
