const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // mock
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    // instance deleteCommentUseCase dengan mock repository
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(useCasePayload.commentId);

    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
