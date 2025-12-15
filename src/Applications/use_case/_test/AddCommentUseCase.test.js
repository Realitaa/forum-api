const AddCommentUseCase = require('../AddCommentUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AddCommentUseCase', () => {
  it('should throw InvariantError when payload does not contain needed property', async () => {
    // Arrange
    const useCasePayload = {}; // content tidak ada

    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should throw InvariantError when payload has wrong data type', async () => {
    // Arrange
    const useCasePayload = {
      content: ['sebuah comment'], // content bukan string
    };

    const addCommentUseCase = new AddCommentUseCase({});

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should orchestrate add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = {
      addComment: jest.fn(() => ({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      })),
    };

    const mockThreadRepository = {
      verifyThreadExists: jest.fn(() => Promise.resolve()),
    };

    // instance addCommentUseCase dengan mock repository
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.addComment)
      .toHaveBeenCalledWith({
        content: useCasePayload.content,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      });

    expect(addedComment).toStrictEqual({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    });
  });
});
