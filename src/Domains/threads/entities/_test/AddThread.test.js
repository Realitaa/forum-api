const AddThread = require('../AddThread');

describe('AddThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      title: 'sebuah thread',
      owner: 'user-123',
    };

    expect(() => new AddThread(payload))
      .toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has wrong data type', () => {
    const payload = {
      title: 'sebuah thread',
      body: ['body'],
      owner: 'user-123',
    };

    expect(() => new AddThread(payload))
      .toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread object correctly', () => {
    const payload = {
      title: 'sebuah thread',
      body: 'sebuah body',
      owner: 'user-123',
    };

    const addThread = new AddThread(payload);

    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
