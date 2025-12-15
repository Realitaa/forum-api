const GetThreadDetail = require('../../Domains/threads/entities/GetThreadDetail');
const ThreadComment = require('../../Domains/comments/entities/ThreadComment');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const getThreadDetail = new GetThreadDetail(useCasePayload);
    const thread = await this._threadRepository.getThreadById(getThreadDetail.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(getThreadDetail.threadId);

    const threadComments = comments.map(
      (comment) => new ThreadComment(comment),
    );

    return new DetailThread({
      ...thread,
      comments: threadComments,
    });
  }
}

module.exports = GetThreadDetailUseCase;
