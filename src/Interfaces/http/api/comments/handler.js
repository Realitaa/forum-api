class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;

    const addCommentUseCase = this._container.getInstance('AddCommentUseCase');

    const addedComment = await addCommentUseCase.execute({
      content,
      owner: userId,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const deleteCommentUseCase = this._container.getInstance('DeleteCommentUseCase');

    await deleteCommentUseCase.execute({
      threadId,
      commentId,
      owner: userId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentsHandler;
