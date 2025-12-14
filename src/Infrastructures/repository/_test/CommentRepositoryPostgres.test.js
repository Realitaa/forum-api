const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

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

      const commentInDatabase = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(commentInDatabase).toBeDefined();
      expect(commentInDatabase.content).toEqual('sebuah comment');
      expect(commentInDatabase.owner).toEqual('user-123');
      expect(commentInDatabase.thread_id).toEqual('thread-123');
      expect(commentInDatabase.is_delete).toEqual(false);
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
      const commentInDatabase = await CommentsTableTestHelper.findCommentById(commentId);
      expect(commentInDatabase).toBeDefined();
      expect(commentInDatabase.content).toEqual('sebuah comment');
      expect(commentInDatabase.owner).toEqual('user-123');
      expect(commentInDatabase.thread_id).toEqual('thread-123');
      expect(commentInDatabase.is_delete).toEqual(true);
    });
  });
});
