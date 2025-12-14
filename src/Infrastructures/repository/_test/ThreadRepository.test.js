const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      // Arrange
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
});
