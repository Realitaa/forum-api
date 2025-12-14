const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);

    const { title, body, owner } = useCasePayload;

    return this._threadRepository.addThread({
      title,
      body,
      owner,
    });
  }

  _validatePayload(payload) {
    const { title, body } = payload;

    if (!title || !body) {
      throw new InvariantError('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new InvariantError('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThreadUseCase;
