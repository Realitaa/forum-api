const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });

      const comment = {
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(comment);

      // Assert
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      });

      const commentsInDatabase = await CommentsTableTestHelper.findCommentsByThreadId('thread-123');

      expect(commentsInDatabase).toHaveLength(1);

      expect(commentsInDatabase[0].content).toEqual('sebuah comment');
      expect(commentsInDatabase[0].owner).toEqual('user-123');
      expect(commentsInDatabase[0].thread_id).toEqual('thread-123');
      expect(commentsInDatabase[0].is_delete).toEqual(false);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when owner does not match', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'johndoe',
        password: 'secret',
        fullname: 'John Doe',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when owner matches', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw NotFoundError when comment does not exist', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentExists('comment-xxx'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when comment exists', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentExists('comment-123'),
      ).resolves.not.toThrow();
    });
  });

  describe('deleteComment function', () => {
    it('should set the comment property is_delete to true', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentId = 'comment-123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment(commentId);

      // Assert & Expect
      const commentsInDatabase = await CommentsTableTestHelper.findCommentsByThreadId('thread-123');

      expect(commentsInDatabase).toHaveLength(1);

      expect(commentsInDatabase[0].content).toEqual('sebuah comment');
      expect(commentsInDatabase[0].owner).toEqual('user-123');
      expect(commentsInDatabase[0].thread_id).toEqual('thread-123');
      expect(commentsInDatabase[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0]).toStrictEqual({
        id: 'comment-123',
        username: 'dicoding',
        date: expect.any(Date),
        content: 'sebuah comment',
        is_delete: false,
      });
    });
  });
});
