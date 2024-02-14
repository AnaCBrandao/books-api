import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Book from 'App/Models/Book'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  public async store({ request, params, response }: HttpContextContract) {
    const body = request.body()
    const bookId = params.bookId

    await Book.findOrFail(bookId)

    body.bookId = bookId

    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: 'Comentário adicionado com sucesso!',
      data: comment,
    }
  }
}
