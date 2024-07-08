import { supabase } from '@re-comment/test-utils/mocks';
import { Supabase } from 'src/clients/supabase.js';
import { beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.useFakeTimers({
    now: 1720375436002,
  });
  vi.mock('@supabase/supabase-js', () => ({
    createClient: () => supabase as Supabase,
  }));
});

