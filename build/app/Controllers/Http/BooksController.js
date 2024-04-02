"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Book_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Book"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const uuid_1 = require("uuid");
class BooksController {
    constructor() {
        this.validationOptions = {
            types: ['image'],
            size: '2mb',
        };
    }
    async store({ request, response }) {
        const body = request.body();
        const image = request.file('image', this.validationOptions);
        if (image) {
            const imageName = `${(0, uuid_1.v4)()}.${image.extname}`;
            await image.move(Application_1.default.tmpPath('uploads'), {
                name: imageName,
            });
            body.image = imageName;
        }
        const book = await Book_1.default.create(body);
        response.status(201);
        return {
            message: 'Livro criado com sucesso',
            data: book,
        };
    }
    async index() {
        const books = await Book_1.default.query().preload('comments');
        return {
            data: books,
        };
    }
    async show({ params }) {
        const book = await Book_1.default.findOrFail(params.id);
        await book.load('comments');
        return {
            data: book,
        };
    }
    async destroy({ params }) {
        const book = await Book_1.default.findOrFail(params.id);
        await book.delete();
        return {
            message: 'Livro excluído com sucesso!',
            data: book,
        };
    }
    async update({ params, request }) {
        const body = request.body();
        const book = await Book_1.default.findOrFail(params.id);
        book.title = body.title;
        book.description = body.description;
        if (book.image !== body.image || !book.image) {
            const image = request.file('image', this.validationOptions);
            if (image) {
                const imageName = `${(0, uuid_1.v4)()}.${image.extname}`;
                await image.move(Application_1.default.tmpPath('uploads'), {
                    name: imageName,
                });
                book.image = imageName;
            }
        }
        await book.save();
        return {
            message: 'Livro atualizado com sucesso',
            data: book,
        };
    }
}
exports.default = BooksController;
//# sourceMappingURL=BooksController.js.map