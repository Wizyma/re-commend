import { User } from '@prisma/client';

export const BASE_USER_MOCK: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'john@doe.fr',
  firstName: 'John',
  lastName: 'Doe',
};
