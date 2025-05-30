import { readonly, type Ref, ref } from 'vue';
import type { PostgrestError } from '@supabase/supabase-js';

import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

export default () => {
	const budgets: Ref<Database['public']['Tables']['budgets']['Row'][]> = ref(
		[]
	);
	const expenses: Ref<
		Database['public']['Tables']['budgets_expenses']['Row'][]
	> = ref([]);

	const loadBudgets = async (accountId: number) => {
		try {
			const { data, error } = await anonClient
				.from('budgets')
				.select()
				.eq('account_id', accountId);

			if (error) {
				throw error;
			}
			if (data) {
				budgets.value = data;
			}
		} catch (error) {
			const supabaseError = error as PostgrestError;
			console.error(supabaseError);
		}
	};

	const loadExpensesForBudget = async (budgetId: number) => {
		try {
			const { data, error } = await anonClient
				.from('budgets_expenses')
				.select()
				.eq('budget_id', budgetId);

			if (error) {
				throw error;
			}
			if (data) {
				expenses.value = data;
			}
		} catch (error) {
			const supabaseError = error as PostgrestError;
			console.error(supabaseError);
		}
	};

	return {
		budgets: readonly(budgets),
		expenses: readonly(expenses),
		loadBudgets,
		loadExpensesForBudget,
	};
};
