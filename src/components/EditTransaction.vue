<template>
	<q-dialog ref="dialogRef">
		<q-card class="edit-transaction-card" bordered flat>
			<q-card-section>
				<div class="row justify-between items-center">
					<div class="text-body1 text-weight-medium">Edit Transaction</div>
					<q-btn @click="onDialogHide" icon="close" size="sm" circle dense />
				</div>
			</q-card-section>
			<q-card-section>
				<q-form ref="editTransactionFormRef" @submit="handleSubmit">
					<TransactionForm
						:loading="loading"
						:transaction="transaction"
						@transaction-form="updateTransactionData($event)"
					/>
				</q-form>
			</q-card-section>
			<q-card-section>
				<div class="row justify-between">
					<q-btn @click="handleDelete" color="negative" label="Delete" />
					<q-btn
						:loading="loading"
						@click="editTransactionFormRef?.submit()"
						color="secondary"
						label="Submit"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { type PropType, reactive, type Ref, ref } from 'vue';
import { QForm, useDialogPluginComponent, useQuasar } from 'quasar';

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
const { updateTransaction, deleteTransaction } = transactions;

const editTransactionFormRef: Ref<QForm | null> = ref(null);
const transactionData: {
	account_id: number;
	category_first: string;
	category_second: string | null;
	date: string;
	name: string;
	amount: number;
} = reactive({
	account_id: props.transaction.account_id,
	category_first: props.transaction.category_first,
	category_second: props.transaction.category_second,
	date: props.transaction.date,
	name: props.transaction.name,
	amount: props.transaction.amount,
});

const updateTransactionData = (event: {
	category_first: string;
	category_second: string | null;
	date: string;
	name: string;
	amount: number;
}) => {
	transactionData.category_first = event.category_first;
	transactionData.category_second = event.category_second;
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
			id: props.transaction.id,
			account_id: props.transaction.account_id,
			category_first: transactionData.category_first,
			category_second: transactionData.category_second,
			date: transactionData.date,
			name: transactionData.name,
			amount: transactionData.amount,
		};
		await updateTransaction(payload);
		onDialogHide();
	} catch (error) {
		console.error(error);
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
			const userId = (await anonClient.auth.getSession()).data.session?.user.id;
			if (!userId) {
				throw new Error('Not authenticated');
			}

			await deleteTransaction(props.transaction.id);

			onDialogHide();
		} catch (error) {
			console.error(error);
		}
	});
};
</script>

<style scoped>
.edit-transaction-card {
	min-width: 300px;
}
</style>
