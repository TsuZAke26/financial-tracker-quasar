import type { Database } from 'src/supabase/types';

export function sortByName(
	account1: Database['accounts']['Tables']['accounts']['Row'],
	account2: Database['accounts']['Tables']['accounts']['Row']
) {
	if (account1.name < account2.name) {
		return -1;
	} else if (account1.name > account2.name) {
		return 1;
	} else {
		return 0;
	}
}
