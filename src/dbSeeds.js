import { faker } from '@faker-js/faker';
import { sanitizeAndSerializeProviderData } from 'wasp/server/auth';

export const devSeed = async (prisma) => {
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
    prisma.book.create({ data: book })
  ));
};

function generateMockBooksData(numOfBooks, userId) {
  return faker.helpers.multiple(() => generateMockBookData(userId), { count: numOfBooks });
}

function generateMockBookData(userId) {
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
