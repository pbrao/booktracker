import { createBook } from './books/actions.ts'

export const devSeed = async (prisma) => {
  const books = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      type: "written",
      status: "read",
      yearRead: 2023,
      genre: "fiction"
    },
    {
      title: "1984",
      author: "George Orwell",
      type: "written",
      status: "currently reading",
      yearRead: 2024,
      genre: "fiction"
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      type: "written",
      status: "will read",
      yearRead: 2024,
      genre: "fiction"
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      type: "audio",
      status: "read",
      yearRead: 2022,
      genre: "fiction"
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      type: "written",
      status: "read",
      yearRead: 2021,
      genre: "fiction"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      type: "audio",
      status: "currently reading",
      yearRead: 2024,
      genre: "fiction"
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      type: "written",
      status: "read",
      yearRead: 2023,
      genre: "nonfiction"
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      type: "audio",
      status: "read",
      yearRead: 2022,
      genre: "nonfiction"
    },
    {
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      type: "written",
      status: "will read",
      yearRead: 2024,
      genre: "nonfiction"
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      type: "audio",
      status: "currently reading",
      yearRead: 2024,
      genre: "nonfiction"
    }
  ]

  for (const book of books) {
    await createBook(book, { entities: { Book: prisma.book } })
  }
}
