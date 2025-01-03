import { createBook } from './books/actions.ts'
import { sanitizeAndSerializeProviderData } from 'wasp/server/auth'

export const devSeed = async (prisma) => {
  // First create a test user
  const testUser = await prisma.user.create({
    data: {
      auth: {
        create: {
          identities: {
            create: {
              providerName: 'username',
              providerUserId: 'testuser',
              providerData: sanitizeAndSerializeProviderData({
                hashedPassword: 'test1234'
              }),
            },
          },
        },
      },
    },
  })

  const books = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      type: "written",
      status: "read",
      yearRead: 2023,
      genre: "fiction",
      userId: testUser.id
    },
    {
      title: "1984",
      author: "George Orwell",
      type: "written",
      status: "currently reading",
      yearRead: 2024,
      genre: "fiction",
      userId: testUser.id
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      type: "written",
      status: "will read",
      yearRead: 2024,
      genre: "fiction",
      userId: testUser.id
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      type: "audio",
      status: "read",
      yearRead: 2022,
      genre: "fiction",
      userId: testUser.id
    },
    {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      type: "written",
      status: "read",
      yearRead: 2021,
      genre: "fiction",
      userId: testUser.id
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      type: "audio",
      status: "currently reading",
      yearRead: 2024,
      genre: "fiction",
      userId: testUser.id
    },
    {
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      type: "written",
      status: "read",
      yearRead: 2023,
      genre: "nonfiction",
      userId: testUser.id
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      type: "audio",
      status: "read",
      yearRead: 2022,
      genre: "nonfiction",
      userId: testUser.id
    },
    {
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      type: "written",
      status: "will read",
      yearRead: 2024,
      genre: "nonfiction",
      userId: testUser.id
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      type: "audio",
      status: "currently reading",
      yearRead: 2024,
      genre: "nonfiction",
      userId: testUser.id
    }
  ]

  // Create books directly through Prisma since actions require auth
  for (const book of books) {
    await prisma.book.create({
      data: book
    })
  }
}
