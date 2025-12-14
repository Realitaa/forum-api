const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      const thread = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      });

      const threadInDatabase = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threadInDatabase).toBeDefined();
      expect(threadInDatabase.title).toEqual('sebuah thread');
      expect(threadInDatabase.body).toEqual('sebuah body thread');
      expect(threadInDatabase.owner).toEqual('user-123');
    });
  });

  describe('verifyThreadExists function', () => {
    it('should not throw error when thread exists', async () => {
    // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'thread',
        body: 'body',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123'))
        .resolves
        .not
        .toThrowError();
    });

    it('should throw NotFoundError when thread does not exist', async () => {
    // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-xxx'))
        .rejects
        .toThrowError(NotFoundError);
    });
  });
});
