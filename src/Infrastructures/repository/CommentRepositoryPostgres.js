const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(thread) {
    const id = `comment-${this._idGenerator()}`;
    const { content, owner, threadId } = thread;

    const query = {
      text: `
        INSERT INTO comments (id, content, owner, thread_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, content, owner
      `,
      values: [id, content, owner, threadId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyCommentOwner(commentId, owner) {
    // cek komentar ada atau tidak
    const checkCommentQuery = {
      text: `
      SELECT owner FROM comments
      WHERE id = $1 AND is_delete = false
    `,
      values: [commentId],
    };

    const commentResult = await this._pool.query(checkCommentQuery);

    if (!commentResult.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    // cek kepemilikan
    const commentOwner = commentResult.rows[0].owner;
    if (commentOwner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses resource ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: `
        UPDATE comments 
        SET is_delete = true 
        WHERE id = $1
      `,
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `
      SELECT
        comments.id,
        users.username,
        comments.date,
        comments.content,
        comments.is_delete
      FROM comments
      JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC
    `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
