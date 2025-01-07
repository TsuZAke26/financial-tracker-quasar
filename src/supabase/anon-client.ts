import { createClient } from '@supabase/supabase-js';
import type { Database } from 'src/supabase/types';

const anonClient = createClient<Database>(
	process.env.VITE_SUPABASE_URL as string,
	process.env.VITE_SUPABASE_KEY as string
);

export { anonClient };
