import { type Book } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type CreateBook, type UpdateBook, type DeleteBook } from "wasp/server/operations";

type CreateBookArgs = Pick<Book, "author" | "title" | "type" | "status" | "yearRead">;

export const createBook: CreateBook<CreateBookArgs, Book> = async (
  { author, title, type, status, yearRead },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Book.create({
    data: {
      author,
      title,
      type,
      status,
      yearRead,
    },
  });
};

type UpdateBookArgs = Pick<Book, "id" | "author" | "title" | "type" | "status" | "yearRead">;

export const updateBook: UpdateBook<UpdateBookArgs> = async (
  { id, author, title, type, status, yearRead },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Book.update({
    where: {
      id,
    },
    data: { author, title, type, status, yearRead },
  });
};

export const deleteBook: DeleteBook<Book["id"]> = async (
  id,
  context
) => {
  return context.entities.Book.delete({
    where: {
      id,
    },
  });
};
