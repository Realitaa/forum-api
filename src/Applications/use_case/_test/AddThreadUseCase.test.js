const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-123',
    };

    // mock
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn(() => ({
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    }));

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

    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual('thread-123');
    expect(addedThread.title).toEqual('sebuah thread');
    expect(addedThread.owner).toEqual('user-123');
  });
});
