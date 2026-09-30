import { type Database } from 'src/supabase/types';

export function sortTransactionsDesc(
	a: Database['accounts']['Tables']['transactions']['Row'],
	b: Database['accounts']['Tables']['transactions']['Row']
) {
	if (a.date < b.date) return 1;
	else if (a.date > b.date) return -1;
	else {
		if (a.created_at < b.created_at) return 1;
		else if (a.created_at > b.created_at) return -1;
		return 0;
	}
}
