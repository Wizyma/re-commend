import { test } from '@re-comment/test-utils/extensions';
import { prisma } from '@re-comment/test-utils/mocks';
import { server } from 'src/index.js';
import { BASE_USER_MOCK } from 'src/mocks/db.js';
import { expect, beforeEach, afterEach } from 'vitest';

beforeEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: BASE_USER_MOCK.email,
    }
  });
});

afterEach(async () => {
  await prisma.user.deleteMany({
    where: {
      email: BASE_USER_MOCK.email,
    }
  });
});

test('GET v1/user/:id', async ({ prisma, supabase, defaultUserResponse }) => {
  await prisma.user.deleteMany({
    where: {
      email: BASE_USER_MOCK.email,
    }
  });

  supabase.auth.getUser.mockResolvedValueOnce({
    data: {
      user: {
        email: BASE_USER_MOCK.email,
        id: '123',
        app_metadata: {
          provider: 'email',
        },
      }
    },
    error: null,
  } as typeof defaultUserResponse);

  const created = await prisma.user.create({ data: BASE_USER_MOCK });
  const user = await prisma.user.findFirst({ where: { id: created.id } });

  const response = await server.inject({
    method: 'GET',
    url: `/v1/auth/user/${user?.id}`,
    headers: { authorization: 'Bearer access_token' },
  });

  expect(response.statusCode).toBe(200);
});

test('GET v1/user/:id - user not authorized', async ({ prisma }) => {
  const user = await prisma.user.create({ data: BASE_USER_MOCK });

  const response = await server.inject({
    method: 'GET',
    url: `/v1/auth/user/${user.id}`,
  });

  expect(response.statusCode).toBe(401);
});