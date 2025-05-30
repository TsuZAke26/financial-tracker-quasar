<template>
	<q-dialog ref="dialogRef">
		<q-card class="add-transaction-card" bordered flat>
			<q-card-section>
				<div class="row justify-between items-center">
					<div class="text-body1 text-weight-medium">Add Transaction</div>
					<q-btn @click="onDialogHide" icon="close" size="sm" circle dense />
				</div>
			</q-card-section>
			<q-card-section>
				<q-form ref="addTransactionFormRef" @submit="handleSubmit">
					<TransactionForm
						:loading="loading"
						@transaction-form="updateTransactionData($event)"
					/>
				</q-form>
			</q-card-section>
			<q-card-section>
				<div class="row justify-end">
					<q-btn
						:loading="loading"
						@click="addTransactionFormRef?.submit()"
						color="secondary"
						label="Submit"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-dialog>
</template>

<script setup lang="ts">
import { reactive, type Ref, ref } from 'vue';
import { QForm, useDialogPluginComponent } from 'quasar';

import { storeTransactions } from 'src/stores/transactions';
import { anonClient } from 'src/supabase/anon-client';
import type { Database } from 'src/supabase/types';

import TransactionForm from './TransactionForm.vue';

defineEmits({
	...useDialogPluginComponent.emits,
});

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
});

const { dialogRef, onDialogHide } = useDialogPluginComponent();

const transactions = storeTransactions();
const { addTransaction } = transactions;

const addTransactionFormRef: Ref<QForm | null> = ref(null);
const transactionData: {
	account_id: number;
	category_main: string;
	category_misc: string | null;
	date: string;
	name: string;
	amount: number;
} = reactive({
	account_id: props.accountId,
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
		const payload: Database['public']['Tables']['transactions']['Insert'] = {
			account_id: props.accountId,
			category_main: transactionData.category_main,
			category_misc: transactionData.category_misc,
			date: transactionData.date,
			name: transactionData.name,
			amount: transactionData.amount,
		};
		await addTransaction(payload);

		onDialogHide();
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.add-transaction-card {
	min-width: 300px;
}
</style>
