const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn(() => ({
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    }));

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

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

    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual('comment-123');
    expect(addedComment.content).toEqual('sebuah comment');
    expect(addedComment.owner).toEqual('user-123');
  });
});
