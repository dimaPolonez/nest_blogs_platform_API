import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  type testObject = {
    basic: string;
    accessToken: string;
    refreshToken: string;
    userID: string;
    blogID: string;
    postID: string;
  };

  const testObject: testObject = {
    basic: 'YWRtaW46cXdlcnR5',
    accessToken: ' ',
    refreshToken: ' ',
    userID: ' ',
    blogID: ' ',
    postID: ' ',
  };

  it('server start (GET /)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('clear base (DELETE /testing/all-data)', () => {
    return request(app.getHttpServer())
      .delete('/testing/all-data')
      .expect(204)
      .expect('delete');
  });

  it('post new user status 201 (POST /users)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Basic ${testObject.basic}`)
      .send({
        login: 'Polonez',
        password: 'pass1234',
        email: 'testPolonez@yandex.ru',
      })
      .expect(201);
  });

  it('post aut user and get tokens status 200 (POST /auth/login)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: 'Polonez',
        password: 'pass1234',
      })
      .expect(200)
      .expect((res) => {
        testObject.accessToken = res.body['accessToken'];
        testObject.refreshToken = res.headers['set-cookie'][0];
        /*        const validAccess: any = jwt.verify(
          testObject.accessToken,
          settings.JWT_SECRET,
        );
        testObject.userID = validAccess.userId;*/
      });
  });

  it('post new blog status 201 (POST /blogs)', () => {
    return request(app.getHttpServer())
      .post('/blogs')
      .set('Authorization', `Basic ${testObject.basic}`)
      .send({
        name: 'Test blog',
        description: 'My test blog',
        websiteUrl: 'polonezTestBlog.com',
      })
      .expect(201)
      .expect((res) => {
        testObject.blogID = res.body.id;
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'Test blog',
          description: 'My test blog',
          websiteUrl: 'polonezTestBlog.com',
          createdAt: expect.any(String),
        });
      });
  });

  it('post new post status 201 (POST /posts)', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Basic ${testObject.basic}`)
      .send({
        title: 'Test post',
        shortDescription: 'My test post',
        content: 'My test content',
        blogId: testObject.blogID,
      })
      .expect(201)
      .expect((res) => {
        testObject.postID = res.body.id;
      })
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(String),
          title: 'Test post',
          shortDescription: 'My test post',
          content: 'My test content',
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

  describe('blogFlow tests start', () => {
    let deleteBlogId = '';
    let postIdByBlogId = '';
    const notFound = '63f0e789e8f1762c4ba45f3e';

    it('get all blog status 200 (GET /blogs)', () => {
      return request(app.getHttpServer()).get('/blogs').expect(200);
    });

    it('get id blog status 200 (GET /blogs/:id)', () => {
      return request(app.getHttpServer())
        .get(`/blogs/${testObject.blogID}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.blogID,
            name: 'Test blog',
            description: 'My test blog',
            websiteUrl: 'polonezTestBlog.com',
            createdAt: expect.any(String),
          });
        });
    });

    it('put id blog status 404 (PUT /blogs/:id)', () => {
      return request(app.getHttpServer())
        .put(`/blogs/${notFound}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          name: 'Test blog upd',
          description: 'My test blog update',
          websiteUrl: 'polonezUpdateTestBlog.com',
        })
        .expect(404);
    });

    it('put id blog status 204 (PUT /blogs/:id)', () => {
      request(app.getHttpServer())
        .put(`/blogs/${testObject.blogID}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          name: 'Test blog upd',
          description: 'My test blog update',
          websiteUrl: 'polonezUpdateTestBlog.com',
        })
        .expect(204);
    });

    it('get id blogUpdate status 200 (GET /blogs/:id)', () => {
      request(app.getHttpServer())
        .get(`/blogs/${testObject.blogID}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.blogID,
            name: 'Test blog upd',
            description: 'My test blog update',
            websiteUrl: 'polonezUpdateTestBlog.com',
            createdAt: expect.any(String),
          });
        });
    });

    it('post new post by id blog status 201 (POST /blogs/:id/posts)', () => {
      request(app.getHttpServer())
        .post(`/blogs/${testObject.blogID}/posts`)
        .set('Authorization', `Basic ${testObject.basic}`)
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
      request(app.getHttpServer())
        .get(`/posts/${postIdByBlogId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: postIdByBlogId,
            title: 'Test post by blog',
            shortDescription: 'My test post by blog',
            content: 'My test content by blog',
            blogId: testObject.blogID,
            blogName: 'Test blog upd',
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

    it('post new deleteBlog status 201 (POST /blogs)', () => {
      request(app.getHttpServer())
        .post('/blogs')
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          name: 'Delete blog',
          description: 'My delete blog',
          websiteUrl: 'polonezDeleteBlog.com',
        })
        .expect(201)
        .expect((res) => {
          deleteBlogId = res.body.id;
        })
        .then((res) => {
          expect(res.body).toEqual({
            id: expect.any(String),
            name: 'Delete blog',
            description: 'My delete blog',
            websiteUrl: 'polonezDeleteBlog.com',
            createdAt: expect.any(String),
          });
        });
    });

    it('delete blog status 404 (DELETE /blogs/:id)', () => {
      request(app.getHttpServer())
        .delete(`/blogs/${notFound}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .expect(404);
    });

    it('delete blog status 204 (DELETE /blogs/:id)', () => {
      request(app.getHttpServer())
        .delete(`/blogs/${deleteBlogId}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .expect(204);
    });

    it('get id blogDelete status 404 (GET /blogs/:id)', () => {
      request(app.getHttpServer()).get(`/blogs/${deleteBlogId}`).expect(404);
    });
  });

  describe('postFlow tests start', () => {
    let deletePostId = '';
    const notFound = '63f0e789e8f1762c4ba45f3e';

    it('get all posts status 200 (GET /posts)', () => {
      request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200);
    });

    it('get id post status 200 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${testObject.postID}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.postID,
            title: 'Test post',
            shortDescription: 'My test post',
            content: 'My test content',
            blogId: testObject.blogID,
            blogName: expect.any(String),
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

    it('put id post status 404 (PUT /posts/:id)', () => {
      request(app.getHttpServer())
        .put(`/posts/${notFound}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          title: 'Test update post',
          shortDescription: 'My update post',
          content: 'My test update content',
          blogId: testObject.blogID,
        })
        .expect(404);
    });

    it('put id post status 204 (PUT /posts/:id)', () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          title: 'Test update post',
          shortDescription: 'My update post',
          content: 'My test update content',
          blogId: testObject.blogID,
        })
        .expect(204);
    });

    it('get id postUpdate status 200 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${testObject.postID}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.postID,
            title: 'Test update post',
            shortDescription: 'My update post',
            content: 'My test update content',
            blogId: testObject.blogID,
            blogName: expect.any(String),
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

    it('post new deletePost status 201 (POST /posts)', () => {
      request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Basic ${testObject.basic}`)
        .send({
          title: 'Test delete post',
          shortDescription: 'My delete post',
          content: 'My delete content',
          blogId: testObject.blogID,
        })
        .expect(201)
        .expect((res) => {
          deletePostId = res.body.id;
        })
        .then((res) => {
          expect(res.body).toEqual({
            id: expect.any(String),
            title: 'Test delete post',
            shortDescription: 'My delete post',
            content: 'My delete content',
            blogId: testObject.blogID,
            blogName: expect.any(String),
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

    it('delete post status 404 (DELETE /posts/:id)', () => {
      request(app.getHttpServer())
        .delete(`/posts/${notFound}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .expect(404);
    });

    it('delete post status 204 (DELETE /posts/:id)', () => {
      request(app.getHttpServer())
        .delete(`/posts/${deletePostId}`)
        .set('Authorization', `Basic ${testObject.basic}`)
        .expect(204);
    });

    it('get id postDelete status 404 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${deletePostId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(404);
    });
  });

  describe('commentFlow tests start', () => {
    let deleteCommentId = '';
    let commentId = '';
    const notFound = '63f0e789e8f1762c4ba45f3e';

    it('post new comment by id post status 201 (POST /posts/:id/comments)', () => {
      request(app.getHttpServer())
        .post(`/posts/${testObject.postID}/comments`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test content by comment',
        })
        .expect(201)
        .expect((res) => {
          commentId = res.body.id;
        })
        .then((res) => {
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

    it('get id comment status 200 (GET /comments/:id)', () => {
      request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: commentId,
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

    it('put id comment status 404 (PUT /comments/:id)', () => {
      request(app.getHttpServer())
        .put(`/comments/${notFound}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test update content',
        })
        .expect(404);
    });

    it('put id comment status 204 (PUT /comments/:id)', () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test update content',
        })
        .expect(204);
    });

    it('get id commentUpdate status 200 (GET /comments/:id)', () => {
      request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: commentId,
            content: 'My test update content',
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

    it('post new deleteComment by id post status 201 (POST /posts/:id/comments)', () => {
      request(app.getHttpServer())
        .post(`/posts/${testObject.postID}/comments`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test content by deleteComment',
        })
        .expect(201)
        .expect((res) => {
          deleteCommentId = res.body.id;
        })
        .then((res) => {
          expect(res.body).toEqual({
            id: expect.any(String),
            content: 'My test content by deleteComment',
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

    it('delete comment status 404 (DELETE /comments/:id)', () => {
      request(app.getHttpServer())
        .delete(`/comments/${notFound}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(404);
    });

    it('delete blog status 204 (DELETE /comments/:id)', () => {
      request(app.getHttpServer())
        .delete(`/comments/${deleteCommentId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(204);
    });

    it('get id postDelete status 404 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${deleteCommentId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(404);
    });
  });

  describe('likeFlow tests start', () => {
    const usersArray = ['User1', 'User2', 'User3', 'User4'];
    const tokensUsersObject: string[] = [];
    let commentId = '';

    usersArray.map((user) => {
      it(`post new ${user} status 201 (POST /users)`, () => {
        request(app.getHttpServer())
          .post('/users')
          .set('Authorization', `Basic ${testObject.basic}`)
          .send({
            login: `${user}`,
            password: 'pass1234',
            email: `${user}@yandex.ru`,
          })
          .expect(201);
      });

      it(`post aut ${user} and get tokens status 200 (POST /auth/login)`, () => {
        request(app.getHttpServer())
          .post('/auth/login')
          .send({
            loginOrEmail: `${user}`,
            password: 'pass1234',
          })
          .expect(200)
          .expect((res) => {
            tokensUsersObject.push(res.body['accessToken']);
          });
      });
    });

    it('post new comment by id post status 201 (POST /posts/:id/comments)', () => {
      request(app.getHttpServer())
        .post(`/posts/${testObject.postID}/comments`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          content: 'My test content by comment',
        })
        .expect(201)
        .expect((res) => {
          commentId = res.body.id;
        })
        .then((res) => {
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

    it(`put like Polonez of comment status 204 (PUT /comments/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it(`put dislike User1 of comment status 204 (PUT /comments/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[0]}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it(`put dislike User2 of comment status 204 (PUT /comments/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[1]}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it(`put like User3 of comment status 204 (PUT /comments/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[2]}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it(`put like User4 of comment status 204 (PUT /comments/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[3]}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it(`put none User4 of comment status 204 (PUT /comments/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[3]}`)
        .send({
          likeStatus: 'None',
        })
        .expect(204);
    });

    it('get id comment of Polonez and statusLike Like and status 200 (GET /comments/:id)', () => {
      request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: commentId,
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 2,
              dislikesCount: 2,
              myStatus: 'Like',
            },
          });
        });
    });

    it('get id comment of User2 and statusLike Dislike and status 200 (GET /comments/:id)', () => {
      request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${tokensUsersObject[1]}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: commentId,
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 2,
              dislikesCount: 2,
              myStatus: 'Dislike',
            },
          });
        });
    });

    it('get id comment of quest and statusLike None and status 200 (GET /comments/:id)', () => {
      request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: commentId,
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 2,
              dislikesCount: 2,
              myStatus: 'None',
            },
          });
        });
    });

    it('get id comment of User4 and statusLike None and status 200 (GET /comments/:id)', () => {
      request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${tokensUsersObject[3]}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: commentId,
            content: 'My test content by comment',
            commentatorInfo: {
              userId: testObject.userID,
              userLogin: 'Polonez',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 2,
              dislikesCount: 2,
              myStatus: 'None',
            },
          });
        });
    });

    it(`put like Polonez of post status 204 /posts/:id/like-status`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it(`put dislike User1 of post status 204 (PUT /posts/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[0]}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it(`put like User2 of post status 204 (PUT /posts/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[1]}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it(`put none User2 of post status 204 (PUT /posts/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[1]}`)
        .send({
          likeStatus: 'None',
        })
        .expect(204);
    });

    it(`put like User3 of post status 204 (PUT /posts/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[2]}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it(`put like User4 of post status 204 (PUT /posts/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${tokensUsersObject[3]}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('get id post of Polonez and statusLike Like, and length likeArray=3 and status 200 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${testObject.postID}`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.postID,
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: testObject.blogID,
            blogName: expect.any(String),
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: 3,
              dislikesCount: 1,
              myStatus: 'Like',
              newestLikes: [
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User4',
                },
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User3',
                },
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'Polonez',
                },
              ],
            },
          });
        });
    });

    it('get id post of User1 and statusLike dislike, and length likeArray=3 and status 200 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${testObject.postID}`)
        .set('Authorization', `Bearer ${tokensUsersObject[0]}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.postID,
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: testObject.blogID,
            blogName: expect.any(String),
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: 3,
              dislikesCount: 1,
              myStatus: 'Dislike',
              newestLikes: [
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User4',
                },
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User3',
                },
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'Polonez',
                },
              ],
            },
          });
        });
    });

    it(`put dislike Polonez of post status 204 (PUT /posts/:id/like-status)`, () => {
      request(app.getHttpServer())
        .put(`/posts/${testObject.postID}/like-status`)
        .set('Authorization', `Bearer ${testObject.accessToken}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('get id post of User2 and statusLike none, and length likeArray=2 and status 200 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${testObject.postID}`)
        .set('Authorization', `Bearer ${tokensUsersObject[1]}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.postID,
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: testObject.blogID,
            blogName: expect.any(String),
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: 2,
              dislikesCount: 2,
              myStatus: 'None',
              newestLikes: [
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User4',
                },
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User3',
                },
              ],
            },
          });
        });
    });

    it('get id post of quest and statusLike none, and length likeArray=2 and status 200 (GET /posts/:id)', () => {
      request(app.getHttpServer())
        .get(`/posts/${testObject.postID}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({
            id: testObject.postID,
            title: expect.any(String),
            shortDescription: expect.any(String),
            content: expect.any(String),
            blogId: testObject.blogID,
            blogName: expect.any(String),
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: 2,
              dislikesCount: 2,
              myStatus: 'None',
              newestLikes: [
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User4',
                },
                {
                  addedAt: expect.any(String),
                  userId: expect.any(String),
                  login: 'User3',
                },
              ],
            },
          });
        });
    });
  });
});
