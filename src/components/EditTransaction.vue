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
	category_main: string;
	category_misc: string | null;
	date: string;
	name: string;
	amount: number;
} = reactive({
	account_id: props.transaction.account_id,
	category_main: props.transaction.category_main,
	category_misc: props.transaction.category_misc,
	date: props.transaction.date,
	name: props.transaction.name,
	amount: props.transaction.amount,
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
			id: props.transaction.id,
			account_id: props.transaction.account_id,
			category_main: transactionData.category_main,
			category_misc: transactionData.category_misc,
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
