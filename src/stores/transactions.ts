import { computed, type Ref, ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';

import type { PostgrestError } from '@supabase/supabase-js';

import { useNotify } from 'src/composables/useNotify';
import type { Database } from 'src/supabase/types';
import { anonClient } from 'src/supabase/anon-client';
import { sortTransactionsDesc } from 'src/util/transaction-utils';

const fetchSize = 10;

export const storeTransactions = defineStore('transactions', () => {
	const loading = ref(false);
	const transactions: Ref<
		Database['public']['Tables']['transactions']['Row'][]
	> = ref([]);
	let totalTransactions = -1;
	let transactionRangeStart = 0;
	let totalPages = 0;

	const loadTransactionCount = async () => {
		const { count, error } = await anonClient
			.from('transactions')
			.select('*', { count: 'planned', head: true });
		if (error) {
			throw error;
		}
		totalTransactions = count ?? 0;
		totalPages = Math.ceil(totalTransactions / fetchSize);
	};

	const addTransactionToStore = (
		transaction: Database['public']['Tables']['transactions']['Row']
	) => {
		const index = transactions.value.findIndex(
			(storeTransaction) => transaction.id === storeTransaction.id
		);
		if (index !== -1) {
			transactions.value.splice(index, 1, transaction);
		} else {
			transactions.value.push(transaction);
		}
		transactions.value.sort(sortTransactionsDesc);
	};

	const removeTransactionFromStore = (id: number) => {
		const index = transactions.value.findIndex(
			(storeTransaction) => id === storeTransaction.id
		);
		if (index !== -1) {
			transactions.value.splice(index, 1);
		}
	};

	const loadTransactions = async (accountId: number) => {
		try {
			loading.value = true;

			await loadTransactionCount();

			const rangeStart = transactionRangeStart * fetchSize;
			const rangeEnd = (transactionRangeStart + 1) * fetchSize - 1;
			const { data, error } = await anonClient
				.from('transactions')
				.select()
				.eq('account_id', accountId)
				.order('date', { ascending: false })
				.range(rangeStart, rangeEnd);

			if (error) {
				throw error;
			}
			if (data) {
				data.forEach((transaction) => addTransactionToStore(transaction));
				transactionRangeStart++;
			}
		} catch (error) {
			const convertedException = error as PostgrestError;
			useNotify(
				'negative',
				'Error loading transactions',
				convertedException.message
			);
		} finally {
			loading.value = false;
		}
	};

	const allPagesLoaded = computed(() => transactionRangeStart === totalPages);

	const resetTransactions = () => {
		transactions.value = [];
		totalTransactions = -1;
		transactionRangeStart = 0;
		totalPages = 0;
	};

	return {
		transactions,
		addTransactionToStore,
		removeTransactionFromStore,
		loadTransactions,
		allPagesLoaded,
		resetTransactions,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(storeTransactions, import.meta.hot));
}
