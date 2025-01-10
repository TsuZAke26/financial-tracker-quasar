import { type Ref, ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { PostgrestError, RealtimeChannel } from '@supabase/supabase-js';

import { useNotify } from 'src/composables/useNotify';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

export const storeAccounts = defineStore('accounts', () => {
	const loading = ref(false);
	const accounts: Ref<Database['public']['Tables']['accounts']['Row'][]> = ref(
		[]
	);
	let subscriptionAccounts: RealtimeChannel;

	const findAccountIndex = (id: number) => {
		return accounts.value.findIndex((account) => id === account.id);
	};
	const updateAccountsEntry = (
		account: Database['public']['Tables']['accounts']['Row']
	) => {
		const index = findAccountIndex(account.id);
		if (index !== -1) {
			accounts.value.splice(index, 1, account);
		}
	};

	const loadAccounts = async () => {
		try {
			loading.value = true;
			const { data, error } = await anonClient.from('accounts').select();

			if (error) {
				throw error;
			}
			if (data) {
				accounts.value = data;
				subscribeToAccounts();
			}
		} catch (error) {
			const convertedException = error as PostgrestError;
			useNotify(
				'negative',
				'Error loading accounts',
				convertedException.message
			);
		} finally {
			loading.value = false;
		}
	};

	const subscribeToAccounts = () => {
		subscriptionAccounts = anonClient
			.channel('subscribe-accounts')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'accounts' },
				(payload) => {
					updateAccountsEntry(
						payload.new as Database['public']['Tables']['accounts']['Row']
					);
				}
			)
			.subscribe();
	};

	const closeAccountsSubscription = () => {
		anonClient.removeChannel(subscriptionAccounts);
	};

	return {
		accounts,
		loading,
		loadAccounts,
		closeAccountsSubscription,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(storeAccounts, import.meta.hot));
}
