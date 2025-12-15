const GetThreadDetail = require('../GetThreadDetail');

describe('GetThreadDetail entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {};

    expect(() => new GetThreadDetail(payload))
      .toThrowError('GET_THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has wrong data type', () => {
    const payload = {
      threadId: 123, // should be string
    };

    expect(() => new GetThreadDetail(payload))
      .toThrowError('GET_THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThreadDetail object correctly', () => {
    const payload = {
      threadId: 'thread-123',
    };

    const getThreadDetail = new GetThreadDetail(payload);

    expect(getThreadDetail.threadId).toEqual(payload.threadId);
  });
});
