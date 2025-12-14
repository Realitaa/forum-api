const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('DeleteCommentUseCase', () => {
  it('should throw InvariantError when payload does not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      // thread tidak ada
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should throw InvariantError when payload has wrong data type', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 123, // content bukan string
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({});

    // Action & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should orchestrate delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // mock
    const mockThreadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
    };

    const mockCommentRepository = {
      verifyCommentOwner: jest.fn(() => Promise.resolve()),
      deleteComment: jest.fn(() => Promise.resolve()),
    };

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

    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.owner);

    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
  });
});
