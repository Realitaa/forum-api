const ThreadComment = require('../ThreadComment');

describe('ThreadComment entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      // username, date, content missing
    };

    // Action & Assert
    expect(() => new ThreadComment(payload))
      .toThrowError('THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has wrong data type', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      is_delete: false,
    };

    // Action & Assert
    expect(() => new ThreadComment(payload))
      .toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadComment correctly when comment is not deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      is_delete: false,
    };

    // Action
    const threadComment = new ThreadComment(payload);

    // Assert
    expect(threadComment.id).toEqual(payload.id);
    expect(threadComment.username).toEqual(payload.username);
    expect(threadComment.date).toEqual(payload.date);
    expect(threadComment.content).toEqual(payload.content);
  });

  it('should hide comment content when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
      is_delete: true,
    };

    // Action
    const threadComment = new ThreadComment(payload);

    // Assert
    expect(threadComment.content).toEqual('**komentar telah dihapus**');
  });
});
