import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { CreatePostDto, EditPostDto } from 'src/post/dto';
import { EditDto } from '../src/user/dto/edit.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const modduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3004);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();

    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'morizuqq@gmail.com',
      password: 'zuqo1234',
    };

    describe('Sign up', () => {
      it('Should throw an exception if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw an exception if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw an exception if body is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });

    describe('Sign in', () => {
      it('Should throw an exception if no password', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('Should throw an exception if no email', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('Should throw an exception if empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('Should sign in', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
          .inspect();
      });
    });
  });

  describe('User', () => {
    describe('Get current user', () => {
      it('Should get current/logged in user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Update User', () => {
      const dto: EditDto = {
        email: 'awesome@gmail.com',
      };
      it('Should update current user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Post', () => {
    describe('Create post', () => {
      const dto: CreatePostDto = {
        title: 'I am a cool dude',
        content: 'I am a cool dude because I am cool in the coolest way',
      };
      it('Should create new post', () => {
        return pactum
          .spec()
          .post('/posts')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('postId', 'id')
          .inspect();
      });
    });

    describe('Update post', () => {
      const dto: EditPostDto = {
        title: 'I am a very cool dude init',
      };
      it('Should upate post', () => {
        return pactum
          .spec()
          .patch('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title);
      });
    });

    describe('Get posts', () => {
      it('Should get all posts', () => {
        return pactum
          .spec()
          .get('/posts')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get post', () => {
      it('Should get a single post by id', () => {
        return pactum
          .spec()
          .get('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{postId}');
      });
    });

    describe('Delete Post', () => {
      it('Should delete post', () => {
        return pactum
          .spec()
          .delete('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
    });

    it('Should get empty posts', () => {
      return pactum
        .spec()
        .get('/posts')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectJsonLength(0);
    });
  });
});
