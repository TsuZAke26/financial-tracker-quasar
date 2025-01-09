import { type Ref, ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { useNotify } from 'src/composables/useNotify';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

export const storeAccounts = defineStore('accounts', () => {
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
		const { data, error } = await anonClient.from('accounts').select();

		if (error) {
			useNotify('negative', 'Error loading accounts', error.message);
		}
		if (data) {
			accounts.value = data;
			subscribeToAccounts();
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
		loadAccounts,
		closeAccountsSubscription,
	};
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(storeAccounts, import.meta.hot));
}
