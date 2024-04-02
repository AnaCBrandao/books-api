"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Book_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Book"));
const Comment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Comment"));
class CommentsController {
    async store({ request, params, response }) {
        const body = request.body();
        const bookId = params.bookId;
        await Book_1.default.findOrFail(bookId);
        body.bookId = bookId;
        const comment = await Comment_1.default.create(body);
        response.status(201);
        return {
            message: 'Comentário adicionado com sucesso!',
            data: comment,
        };
    }
}
exports.default = CommentsController;
//# sourceMappingURL=CommentsController.js.map