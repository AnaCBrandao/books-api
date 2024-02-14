import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Book from 'App/Models/Book'

import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

export default class BooksController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const book = await Book.create(body)

    response.status(201)

    return {
      message: 'Livro criado com sucesso',
      data: book,
    }
  }

  public async index() {
    const books = await Book.query().preload('comments')

    return {
      data: books,
    }
  }

  public async show({ params }: HttpContextContract) {
    const book = await Book.findOrFail(params.id)

    await book.load('comments')

    return {
      data: book,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const book = await Book.findOrFail(params.id)

    await book.delete()

    return {
      message: 'Livro excluído com sucesso!',
      data: book,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const book = await Book.findOrFail(params.id)

    book.title = body.title
    book.description = body.description

    if (book.image !== body.image || !book.image) {
      const image = request.file('image', this.validationOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        book.image = imageName
      }
    }

    await book.save()

    return {
      message: 'Livro atualizado com sucesso',
      data: book,
    }
  }
}
