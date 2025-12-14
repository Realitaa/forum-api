const InvariantError = require('../../Commons/exceptions/InvariantError');
const ThreadComment = require('../../Domains/comments/entities/ThreadComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const threadComments = comments.map(
      (comment) => new ThreadComment({
        ...comment,
        date: comment.date instanceof Date
          ? comment.date.toISOString()
          : comment.date,
      }),
    );

    return new DetailThread({
      ...thread,
      date: thread.date instanceof Date
        ? thread.date.toISOString()
        : thread.date,
      comments: threadComments,
    });
  }

  _validatePayload(payload) {
    const { threadId } = payload;

    if (!threadId) {
      throw new InvariantError(
        'GET_THREAD_DETAIL_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY',
      );
    }

    if (typeof threadId !== 'string') {
      throw new InvariantError(
        'GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION',
      );
    }
  }
}

module.exports = GetThreadDetailUseCase;
