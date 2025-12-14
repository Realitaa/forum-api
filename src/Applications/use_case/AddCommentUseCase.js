const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { content, owner, threadId } = useCasePayload;

    await this._threadRepository.verifyThreadExists(threadId);

    return this._commentRepository.addComment({
      content,
      owner,
      threadId,
    });
  }

  _validatePayload(payload) {
    const { content } = payload;

    if (!content) {
      throw new InvariantError('ADD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new InvariantError('ADD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;
