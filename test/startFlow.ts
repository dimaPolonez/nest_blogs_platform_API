import { myLikeStatus, testObject } from '../src/models';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

export function startFlow(): testObject {
  const testObject: testObject = {
    basic: 'YWRtaW46cXdlcnR5',
    accessToken: ' ',
    refreshToken: ' ',
    userID: ' ',
    blogID: ' ',
    postID: ' ',
  };

  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('startFlow', () => {
    it('server start (GET /)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('clear base (DELETE /testing/all-data)', () => {
      return request(app.getHttpServer())
        .delete('/testing/all-data')
        .expect(204);
    });

    it('post new user status 201 (POST /users)', () => {
      return (
        request(app.getHttpServer())
          .post('/users')
          //.set('Authorization', `Basic ${testObject.basic}`)
          .send({
            login: 'Polonez',
            password: 'pass1234',
            email: 'testPolonez@yandex.ru',
          })
          .expect(201)
          .expect((res) => {
            return {
              id: res.body._id,
              login: 'Polonez',
              email: 'testPolonez@yandex.ru',
              createdAt: res.body.createdAt,
            };
          })
      );
    });

    it('post new blog status 201 (POST /blogs)', () => {
      return (
        request(app.getHttpServer())
          .post('/blogs')
          //.set('Authorization', `Basic ${testObject.basic}`)
          .send({
            name: 'Test blog',
            description: 'My test blog',
            websiteUrl: 'polonezTestBlog.com',
          })
          .expect(201)
          .expect((res) => {
            testObject.blogID = res.body.id;
            expect(res.body).toEqual({
              id: expect.any(String),
              name: 'Test blog',
              description: 'My test blog',
              websiteUrl: 'polonezTestBlog.com',
              createdAt: expect.any(String),
              isMembership: expect.any(Boolean),
            });
          })
      );
    });

    it('post new post status 201 (POST /posts)', () => {
      return (
        request(app.getHttpServer())
          .post('/posts')
          //.set('Authorization', `Basic ${testObject.basic}`)
          .send({
            title: 'Test post',
            shortDescription: 'My test post',
            content: 'My test content',
            blogId: testObject.blogID,
          })
          .expect(201)
          .expect((res) => {
            testObject.postID = res.body.id;
            expect(res.body).toEqual({
              id: expect.any(String),
              title: 'Test post',
              shortDescription: 'My test post',
              content: 'My test content',
              blogId: testObject.blogID,
              blogName: 'Test blog',
              createdAt: expect.any(String),
              extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myLikeStatus.None,
                newestLikes: [],
              },
            });
          })
      );
    });
  });
  return testObject;
}
