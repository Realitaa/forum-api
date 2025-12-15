const DeleteComment = require('../DeleteComment');

describe('DeleteComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      // thread tidak ada
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has wrong data type', () => {
    // Arrange
    const payload = {
      threadId: 123, // threadId bukan string
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const deleteComment = new DeleteComment(payload);

    // Assert
    expect(deleteComment.threadId).toEqual(payload.threadId);
    expect(deleteComment.commentId).toEqual(payload.commentId);
    expect(deleteComment.owner).toEqual(payload.owner);
  });
});
