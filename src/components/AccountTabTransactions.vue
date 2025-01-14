<template>
	<div v-if="transactionsInStore.length > 0" class="col q-gutter-sm">
		<TransactionItem
			v-for="transaction in pagedTransactions"
			:key="transaction.id"
			:transaction="transaction"
		/>

		<div class="row justify-center">
			<q-pagination
				v-model="currentPage"
				:max="totalPages"
				direction-links
				:max-pages="7"
				boundary-numbers
			/>
		</div>

		<div class="row justify-center">
			<q-btn
				label="Load More Transactions"
				@click="loadTransactions(accountId)"
				color="primary"
				outlined
			/>
		</div>
	</div>
	<div v-else class="text-center">No transactions found</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { storeTransactions } from 'src/stores/transactions';

import TransactionItem from './TransactionItem.vue';

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
});

const transactions = storeTransactions();
const { loadTransactions } = transactions;
const { transactions: transactionsInStore } = storeToRefs(transactions);

await loadTransactions(props.accountId);

const pageSize = 6;
const currentPage = ref(1);
const totalPages = computed(() =>
	Math.ceil(transactionsInStore.value.length / pageSize)
);
const pagedTransactions = computed(() => {
	const startIndex = (currentPage.value - 1) * pageSize;
	const endIndex = currentPage.value * pageSize;

	return transactionsInStore.value.slice(startIndex, endIndex);
});
</script>

<style scoped></style>
