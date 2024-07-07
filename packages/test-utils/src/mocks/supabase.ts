import { SupabaseClient, UserResponse } from '@supabase/supabase-js';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
  mockReset(supabase);
});

export const supabase = mockDeep<SupabaseClient>();
export const defaultUserResponse = mockDeep<UserResponse>();
