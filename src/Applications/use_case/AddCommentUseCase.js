const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { content, owner, threadId } = useCasePayload;

    await this._threadRepository.verifyThreadExists(threadId);

    const addedComment = await this._commentRepository.addComment({
      content,
      owner,
      threadId,
    });

    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
