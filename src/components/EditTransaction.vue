<template>
	<q-dialog ref="dialogRef">
		<q-card flat bordered class="edit-transaction-card">
			<q-card-section>
				<div class="row justify-between items-center">
					<div class="text-body1 text-weight-medium">Edit Transaction</div>
					<q-btn dense size="sm" circle icon="close" @click="onDialogHide" />
				</div>
			</q-card-section>
			<q-card-section>
				<q-form ref="editTransactionFormRef" @submit="handleSubmit">
					<TransactionForm
						@transaction-form="updateTransactionData($event)"
						:transaction="transaction"
						:loading="loading"
					/>
				</q-form>
			</q-card-section>
			<q-card-section>
				<div class="row justify-between">
					<q-btn label="Delete" color="negative" @click="handleDelete" />
					<q-btn
						label="Submit"
						color="secondary"
						@click="editTransactionFormRef?.submit()"
						:loading="loading"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { type PropType, reactive, type Ref, ref } from 'vue';
import { QForm, useDialogPluginComponent, useQuasar } from 'quasar';
import type { PostgrestError } from '@supabase/supabase-js';

import { useNotify } from 'src/composables/useNotify';
import { storeTransactions } from 'src/stores/transactions';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

import TransactionForm from './TransactionForm.vue';

defineEmits({
	...useDialogPluginComponent.emits,
});

const props = defineProps({
	transaction: {
		type: Object as PropType<
			Database['public']['Tables']['transactions']['Row']
		>,
		required: true,
	},
});

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const transactions = storeTransactions();
const { addTransactionToStore, removeTransactionFromStore } = transactions;

const editTransactionFormRef: Ref<QForm | null> = ref(null);
const transactionData: {
	account_id: number;
	category_main: string;
	category_misc: string | null;
	date: string;
	name: string;
	amount: number;
} = reactive({
	account_id: props.transaction.account_id,
	category_main: '',
	category_misc: null,
	date: new Date().toISOString().split('T')[0] as string,
	name: '',
	amount: 0,
});

const updateTransactionData = (event: {
	category_main: string;
	category_misc: string | null;
	date: string;
	name: string;
	amount: number;
}) => {
	transactionData.category_main = event.category_main;
	transactionData.category_misc = event.category_misc;
	transactionData.date = event.date;
	transactionData.name = event.name;
	transactionData.amount = event.amount;
};

const loading = ref(false);
const handleSubmit = async () => {
	try {
		loading.value = true;

		const userId = (await anonClient.auth.getSession()).data.session?.user.id;
		if (!userId) {
			throw new Error('Not authenticated');
		}
		const payload: Database['public']['Tables']['transactions']['Update'] = {
			account_id: props.transaction.account_id,
			category_main: transactionData.category_main,
			category_misc: transactionData.category_misc,
			date: transactionData.date,
			name: transactionData.name,
			amount: transactionData.amount,
		};
		const { data, error } = await anonClient
			.from('transactions')
			.update(payload)
			.eq('id', props.transaction.id)
			.select();
		if (error) {
			throw error;
		}
		if (data) {
			const updatedTransaction =
				data[0] as Database['public']['Tables']['transactions']['Row'];
			addTransactionToStore(updatedTransaction);
		}
		onDialogHide();

		useNotify('positive', 'Transaction updated successfully');
	} catch (error) {
		const supabaseError = error as PostgrestError;
		console.error(supabaseError);
		useNotify('negative', 'Error updating transaction', supabaseError.message);
	} finally {
		loading.value = false;
	}
};

const $q = useQuasar();
const handleDelete = () => {
	$q.dialog({
		title: 'Delete Transaction',
		message: 'Are you sure you want to delete this transaction?',
		cancel: true,
	}).onOk(async () => {
		try {
			loading.value = true;

			const userId = (await anonClient.auth.getSession()).data.session?.user.id;
			if (!userId) {
				throw new Error('Not authenticated');
			}

			const { error } = await anonClient
				.from('transactions')
				.delete()
				.eq('id', props.transaction.id);
			if (error) {
				throw error;
			}
			removeTransactionFromStore(props.transaction.id);

			useNotify('positive', 'Transaction Deleted');
			onDialogHide();
		} catch (error) {
			const supabaseError = error as PostgrestError;
			console.error(supabaseError);
			useNotify(
				'negative',
				'Error deleting transaction',
				supabaseError.message
			);
		} finally {
			loading.value = false;
		}
	});
};
</script>

<style scoped>
.edit-transaction-card {
	min-width: 300px;
}
</style>
