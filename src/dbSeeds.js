import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@prisma/client';
import { sanitizeAndSerializeProviderData } from 'wasp/server/auth';

type MockBookData = {
  title: string;
  author: string;
  type: 'written' | 'audio';
  status: 'read' | 'currently reading' | 'will read';
  yearRead: number;
  genre: 'fiction' | 'nonfiction';
  userId: number;
};

export const devSeed = async (prisma: PrismaClient) => {
  // Create test user
  const testUser = await prisma.user.create({
    data: {
      auth: {
        create: {
          identities: {
            create: {
              providerName: 'username',
              providerUserId: 'testuser',
              providerData: await sanitizeAndSerializeProviderData({
                hashedPassword: 'test1234'
              }),
            },
          },
        },
      },
    },
  });

  // Generate mock books
  const books = generateMockBooksData(10, testUser.id);
  
  // Create books
  await Promise.all(books.map(book => 
    prisma.book.create({ 
      data: {
        title: book.title,
        author: book.author,
        type: book.type,
        status: book.status,
        yearRead: book.yearRead,
        genre: book.genre,
        user: {
          connect: {
            id: book.userId
          }
        }
      }
    })
  ));
};

function generateMockBooksData(numOfBooks: number, userId: number): MockBookData[] {
  return faker.helpers.multiple(() => generateMockBookData(userId), { count: numOfBooks });
}

function generateMockBookData(userId: number): MockBookData {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  
  return {
    title: faker.lorem.words({ min: 1, max: 5 }),
    author: faker.person.fullName(),
    type: faker.helpers.arrayElement(['written', 'audio']),
    status: faker.helpers.arrayElement(['read', 'currently reading', 'will read']),
    yearRead: faker.helpers.arrayElement(years),
    genre: faker.helpers.arrayElement(['fiction', 'nonfiction']),
    userId
  };
}
