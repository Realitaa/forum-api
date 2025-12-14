const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'sebuah comment',
    owner = 'user-123',
    threadId = 'thread-123',
  }) {
    const query = {
      text: `
        INSERT INTO comments (id, content, owner, thread_id)
        VALUES ($1, $2, $3, $4)
      `,
      values: [id, content, owner, threadId],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows[0];
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments');
  },
};

module.exports = CommentsTableTestHelper;
