import { test } from "@re-comment/test-utils/extensions";
import { prisma } from "@re-comment/test-utils/mocks";
import { server } from "src/index.js";
import { BASE_USER_MOCK } from "src/mocks/db.js";
import { expect, beforeEach, afterEach } from "vitest";

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

test.skip("POST v1/auth/user", async ({ prisma, supabase }) => {
  supabase.auth.signUp.mockResolvedValueOnce({
    data: {
      session: {
        access_token: "accesstoken",
        // @ts-expect-error - we don't need to mock the whole response
        user: BASE_USER_MOCK
      }
    },
    error: null
  });

  const response = await server.inject({
    url: "/v1/auth/user",
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
    payload: {
      ...BASE_USER_MOCK,
      password: "password123"
    }
  });

  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: BASE_USER_MOCK.email
    }
  });

  expect(user).not.toBeNull();
  expect(user.email).toBe(BASE_USER_MOCK.email);
  expect(response.statusCode).toBe(201);
});