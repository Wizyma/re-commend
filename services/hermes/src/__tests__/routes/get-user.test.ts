import { User } from '@prisma/client';
import { test } from '@re-comment/test-utils/extensions';
import { supabase } from '@re-comment/test-utils/mocks';
import { Supabase } from 'src/clients/supabase.js';
import { server } from 'src/index.js';
import { beforeAll, expect, vi } from 'vitest';


beforeAll(() => {
  vi.spyOn(global.Date, 'now').mockReturnValue(0);
  vi.mock('@supabase/supabase-js', () => ({
    createClient: () => supabase as Supabase,
  }));
});

const PRISMA_USER_MOCK: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
  email: 'john@doe.fr',
  firstName: 'John',
  lastName: 'Doe',
};

test('GET v1/user/:id', async ({ prisma, supabase, defaultUserResponse }) => {
  await prisma.user.deleteMany({
    where: {
      email: PRISMA_USER_MOCK.email,
    }
  });

  supabase.auth.getUser.mockResolvedValueOnce({
    data: {
      user: {
        email: PRISMA_USER_MOCK.email,
        id: '123',
        app_metadata: {
          provider: 'email',
        },
      }
    },
    error: null,
  } as typeof defaultUserResponse);

  const created = await prisma.user.create({ data: PRISMA_USER_MOCK });

  const user = await prisma.user.findFirst({ where: { id: created.id } });

  const response = await server.inject({
    method: 'GET',
    url: `/v1/auth/user/${user?.id}`,
    headers: { authorization: 'Bearer access_token' },
  });

  expect(response.statusCode).toBe(200);
});

test('GET v1/user/:id - user not authorized', async ({ prisma }) => {
  await prisma.user.deleteMany({
    where: {
      email: PRISMA_USER_MOCK.email,
    }
  });

  const user = await prisma.user.create({ data: PRISMA_USER_MOCK });

  const response = await server.inject({
    method: 'GET',
    url: `/v1/auth/user/${user.id}`,
  });

  expect(response.statusCode).toBe(401);
});