const ThreadComment = require('../../Domains/comments/entities/ThreadComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const threadComments = comments.map((comment) => new ThreadComment({
      ...comment,
      date: comment.date instanceof Date
        ? comment.date.toISOString()
        : comment.date,
    }));

    return new DetailThread({
      ...thread,
      date: thread.date instanceof Date
        ? thread.date.toISOString()
        : thread.date,
      comments: threadComments,
    });
  }
}

module.exports = GetThreadDetailUseCase;
