const DetailThread = require('../DetailThread');
const ThreadComment = require('../../../comments/entities/ThreadComment');

describe('DetailThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      // body, date, username, comments missing
    };

    // Action & Assert
    expect(() => new DetailThread(payload))
      .toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has wrong data type', () => {
    // Arrange
    const payload = {
      id: 123, // should be string
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2021-08-08',
      username: 'dicoding',
      comments: [],
    };

    // Action & Assert
    expect(() => new DetailThread(payload))
      .toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread entity correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
      comments: [
        new ThreadComment({
          id: 'comment-123',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
          is_delete: false,
        }),
        new ThreadComment({
          id: 'comment-321',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: 'sebuah comment',
          is_delete: true,
        }),
      ],
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
    expect(detailThread.comments).toHaveLength(2);
    expect(detailThread.comments[0]).toBeInstanceOf(ThreadComment);
    expect(detailThread.comments[1]).toBeInstanceOf(ThreadComment);
    expect(detailThread.comments[1].content)
      .toEqual('**komentar telah dihapus**');
  });
});
