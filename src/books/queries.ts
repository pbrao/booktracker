import { type Book } from "wasp/entities";
import { HttpError } from "wasp/server";
import { type GetBooks } from "wasp/server/operations";

export const getBooks = (async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Book.findMany({
    orderBy: { id: "asc" },
  });
}) satisfies GetBooks<void, Book[]>;
