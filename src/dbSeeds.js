import { faker } from '@faker-js/faker';
import { sanitizeAndSerializeProviderData } from 'wasp/server/auth';

export const devSeed = async (prisma) => {
  // Check if test user already exists
  let testUser = await prisma.user.findFirst({
    where: {
      auth: {
        identities: {
          some: {
            providerUserId: 'testuser'
          }
        }
      }
    }
  });

  // If test user doesn't exist, create it
  if (!testUser) {
    testUser = await prisma.user.create({
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
  }

  // Delete existing books to avoid duplicates
  await prisma.book.deleteMany({});

  // Generate mock books
  const books = generateMockBooksData(10);
  
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
        User: {
          connect: {
            id: testUser.id
          }
        }
      }
    })
  ));
};

function generateMockBooksData(numOfBooks) {
  return faker.helpers.multiple(() => generateMockBookData(), { count: numOfBooks });
}

function generateMockBookData() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];
  
  return {
    title: faker.lorem.words({ min: 1, max: 5 }),
    author: faker.person.fullName(),
    type: faker.helpers.arrayElement(['written', 'audio']),
    status: faker.helpers.arrayElement(['read', 'currently reading', 'will read']),
    yearRead: faker.helpers.arrayElement(years),
    genre: faker.helpers.arrayElement(['fiction', 'nonfiction'])
  };
}
