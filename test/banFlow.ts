import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { TestObjectType } from './app.e2e-spec';

export function banFlow(testObject: TestObjectType) {
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

  describe('BanFlow', () => {
    let commentId1 = '';
    let commentId2 = '';
    let commentId3 = '';
    let postIdByBlogId = '';
    const notFound = '63f0e789e8f1762c4ba45f3e';

    it('post new post by id blog status 201 (POST /blogger/blogs/:id/posts)', () => {
      return request(app.getHttpServer())
        .post(`/blogger/blogs/${testObject.blogID}/posts`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          title: 'Test post by blog',
          shortDescription: 'My test post by blog',
          content: 'My test content by blog',
        })
        .expect(201)
        .expect((res) => {
          postIdByBlogId = res.body.id;
        });
    });

    it('get post by id blog status 200 (GET /posts/:id)', () => {
      return request(app.getHttpServer())
        .get(`/posts/${postIdByBlogId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            id: postIdByBlogId,
            title: 'Test post by blog',
            shortDescription: 'My test post by blog',
            content: 'My test content by blog',
            blogId: testObject.blogID,
            blogName: 'Test blog',
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: expect.any(Number),
              dislikesCount: expect.any(Number),
              myStatus: expect.any(String),
              newestLikes: expect.any(Array),
            },
          });
        });
    });
    it('post new comment by id post status 201 (POST /posts/:id/comments)', () => {
      return request(app.getHttpServer())
        .post(`/posts/${postIdByBlogId}/comments`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test content by comment',
        })
        .expect(201)
        .expect((res) => {
          commentId1 = res.body.id;
          expect(res.body).toEqual({
            id: expect.any(String),
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: expect.any(Number),
              dislikesCount: expect.any(Number),
              myStatus: expect.any(String),
            },
          });
        });
    });
    it('post new comment by id post status 201 (POST /posts/:id/comments)', () => {
      return request(app.getHttpServer())
        .post(`/posts/${postIdByBlogId}/comments`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test content by comment',
        })
        .expect(201)
        .expect((res) => {
          commentId2 = res.body.id;
          expect(res.body).toEqual({
            id: expect.any(String),
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: expect.any(Number),
              dislikesCount: expect.any(Number),
              myStatus: expect.any(String),
            },
          });
        });
    });
    it('post new comment by id post status 201 (POST /posts/:id/comments)', () => {
      return request(app.getHttpServer())
        .post(`/posts/${postIdByBlogId}/comments`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test content by comment',
        })
        .expect(201)
        .expect((res) => {
          commentId3 = res.body.id;
          expect(res.body).toEqual({
            id: expect.any(String),
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: expect.any(Number),
              dislikesCount: expect.any(Number),
              myStatus: expect.any(String),
            },
          });
        });
    });

    it('ban user status 204 (PUT /sa/users/:id/ban)', () => {
      return request(app.getHttpServer())
        .put(`/sa/users/${testObject.userID}/ban`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          isBanned: true,
          banReason: 'stringstringstringst',
        })
        .expect(204);
    });

    it('post new post by id blog status 401 (POST /blogger/blogs/:id/posts)', () => {
      return request(app.getHttpServer())
        .post(`/blogger/blogs/${testObject.blogID}/posts`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          title: 'Test post by blog',
          shortDescription: 'My test post by blog',
          content: 'My test content by blog',
        })
        .expect(401);
    });

    it('login ban user status 401 (POST /auth/login)', () => {
      return request(app.getHttpServer())
        .post(`/auth/login`)
        .send({
          loginOrEmail: 'Polonez',
          password: 'pass1234',
        })
        .expect(401);
    });

    it('get id comment status 404 (GET /comments/:id)', () => {
      return request(app.getHttpServer())
        .get(`/comments/${commentId1}`)
        .expect(404);
    });

    it('unban user status 204 (PUT /sa/users/:id/ban)', () => {
      return request(app.getHttpServer())
        .put(`/sa/users/${testObject.userID}/ban`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          isBanned: false,
          banReason: 'stringstringstringst',
        })
        .expect(204);
    });

    it('login unban user status 200 (POST /auth/login)', () => {
      return request(app.getHttpServer())
        .post(`/auth/login`)
        .send({
          loginOrEmail: 'Polonez',
          password: 'pass1234',
        })
        .expect(200);
    });

    it('get id comment status 200 (GET /comments/:id)', () => {
      return request(app.getHttpServer())
        .get(`/comments/${commentId1}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200);
    });
  });
}
