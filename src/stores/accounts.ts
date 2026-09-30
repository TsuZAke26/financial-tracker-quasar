import { type Ref, ref } from 'vue';
import { defineStore, acceptHMRUpdate } from 'pinia';
import type { PostgrestError } from '@supabase/supabase-js';

import { useNotify } from 'src/composables/useNotify';
import { accountsSchema } from 'src/supabase/clients';
import type { Database } from 'src/supabase/types';

export const storeAccounts = defineStore(
	'accounts',
	() => {
		const loading = ref(false);
		const accounts: Ref<Database['accounts']['Tables']['accounts']['Row'][]> =
			ref([]);

		const _findAccountIndex = (id: number) => {
			return accounts.value.findIndex((account) => id === account.id);
		};

		const getAccountById = (id: number) => {
			const index = _findAccountIndex(id);
			if (index !== -1) {
				return accounts.value[index];
			}
		};

		const loadAccounts = async () => {
			try {
				loading.value = true;
				const { data, error } = await accountsSchema.from('accounts').select();

				if (error) {
					throw error;
				}
				if (data) {
					accounts.value = data;
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

		const addAccount = async (
			newAccount: Database['accounts']['Tables']['accounts']['Insert']
		) => {
			try {
				loading.value = true;
				const { data, error } = await accountsSchema
					.from('accounts')
					.insert(newAccount)
					.select()
					.single();
				if (error) {
					throw error;
				}
				if (data) {
					accounts.value.push(data);
					useNotify('positive', 'Account added successfully!');
				}
			} catch (error) {
				const supabaseError = error as PostgrestError;
				useNotify('negative', 'Error adding account', supabaseError.message);
				throw supabaseError;
			} finally {
				loading.value = false;
			}
		};

		const updateAccount = async (
			account: Database['accounts']['Tables']['accounts']['Update']
		) => {
			try {
				loading.value = true;

				const accountId = account.id;
				if (!accountId) {
					throw Error('Missing account id');
				}
				const { data, error } = await accountsSchema
					.from('accounts')
					.update(account)
					.eq('id', accountId)
					.select()
					.single();
				if (error) {
					throw error;
				}
				if (data) {
					const accountIndex = _findAccountIndex(accountId);
					if (accountIndex !== -1) {
						accounts.value.splice(accountIndex, 1, data);
					}
					useNotify('positive', 'Account updated successfully!');
				}
			} catch (error) {
				const supabaseError = error as PostgrestError;
				useNotify('negative', 'Error updating account', supabaseError.message);
				throw supabaseError;
			} finally {
				loading.value = false;
			}
		};

		const deleteAccount = async (accountId: number) => {
			try {
				loading.value = true;

				const { error } = await accountsSchema
					.from('accounts')
					.delete()
					.eq('id', accountId);
				if (error) {
					throw error;
				}

				const accountIndex = _findAccountIndex(accountId);
				if (accountIndex !== -1) {
					accounts.value.splice(accountIndex, 1);
				}
				useNotify('positive', 'Account Deleted');
			} catch (error) {
				const supabaseError = error as PostgrestError;
				useNotify('negative', 'Error deleting account', supabaseError.message);
				throw supabaseError;
			} finally {
				loading.value = false;
			}
		};

		return {
			accounts,
			getAccountById,
			loading,
			loadAccounts,
			addAccount,
			updateAccount,
			deleteAccount,
		};
	},
	{
		persist: true,
	}
);

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(storeAccounts, import.meta.hot));
}
