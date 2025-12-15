const AddThreadUseCase = require('../AddThreadUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AddThreadUseCase', () => {
  it('should throw InvariantError when payload does not contain needed property', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread', // body tidak ada
    };

    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should throw InvariantError when payload has wrong data type', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: ['sebuah body thread'], // body bukan string
    };

    const addThreadUseCase = new AddThreadUseCase({});

    // Action & Assert
    await expect(addThreadUseCase.execute(useCasePayload))
      .rejects
      .toThrow(InvariantError);
  });

  it('should orchestrate add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    // mock
    const mockThreadRepository = {
      addThread: jest.fn(() => ({
        id: 'thread-123',
        title: 'sebuah thread',
        owner: 'user-123',
      })),
    };

    // instance AddThreadUseCase dengan mock repository
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toHaveBeenCalledWith({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    });

    expect(addedThread).toStrictEqual({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    });
  });
});
