import { createClient } from '@supabase/supabase-js';
import type { Database } from 'src/supabase/types';

const anonClient = createClient<Database>(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_KEY as string
);

const accountsSchema = createClient<Database, 'accounts'>(
	process.env.SUPABASE_URL as string,
	process.env.SUPABASE_KEY as string,
	{
		db: {
			schema: 'accounts',
		},
	}
);

export { anonClient, accountsSchema };
