const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadComment = require('../../../Domains/comments/entities/ThreadComment');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'dicoding',
    }));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
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
        content: 'comment lainnya',
        is_delete: true,
      },
    ]));

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

  it('should handle Date object correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body',
      date: new Date('2021-08-08T07:19:09.775Z'),
      username: 'dicoding',
    }));

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      {
        id: 'comment-123',
        username: 'johndoe',
        date: new Date('2021-08-08T07:22:33.555Z'),
        content: 'sebuah comment',
        is_delete: false,
      },
    ]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const result = await getThreadDetailUseCase.execute(useCasePayload);

    expect(result).toBeInstanceOf(DetailThread);
    expect(result.date).toEqual('2021-08-08T07:19:09.775Z');
    expect(result.comments[0].date).toEqual('2021-08-08T07:22:33.555Z');
  });
});
