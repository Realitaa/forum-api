const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('GetThreadDetailUseCase', () => {
  it('should throw InvariantError when payload does not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};

    const getThreadDetailUseCase = new GetThreadDetailUseCase({});

    // Action & Assert
    await expect(getThreadDetailUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should orchestrate get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'johndoe',
        date: '2021-08-08T07:22:33.555Z',
        content: 'sebuah comment',
        is_delete: false,
      },
      {
        id: 'comment-321',
        username: 'dicoding',
        date: '2021-08-08T07:26:21.338Z',
        content: 'komentar lama',
        is_delete: true,
      },
    ];

    const mockThreadRepository = {
      getThreadById: jest.fn(() => Promise.resolve(mockThread)),
    };

    const mockCommentRepository = {
      getCommentsByThreadId: jest.fn(() => Promise.resolve(mockComments)),
    };

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(mockCommentRepository.getCommentsByThreadId)
      .toHaveBeenCalledWith(useCasePayload.threadId);

    expect(result).toBeInstanceOf(DetailThread);
    expect(result.comments[0]).toBeInstanceOf(ThreadComment);
    expect(result.comments[1].content)
      .toEqual('**komentar telah dihapus**');
  });
});
