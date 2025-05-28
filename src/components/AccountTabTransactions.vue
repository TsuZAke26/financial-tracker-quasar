<template>
	<!-- Transaction Filters -->
	<q-expansion-item
		expand-separator
		label="Filters"
		class="rounded-borders"
		style="border: 1px solid gray"
	>
		<q-card>
			<q-card-section>
				<!-- Mobile -->
				<div class="lt-sm col q-col-gutter-md">
					<q-input
						v-model="filters.name"
						outlined
						label="Transaction name"
						clearable
					>
						<template #append>
							<q-icon name="search" />
						</template>
					</q-input>
					<q-select
						outlined
						v-model="filters.categories"
						:options="TRANSACTION_CATEGORIES_MAIN"
						use-chips
						multiple
						stack-label
						label="Categories"
						behavior="menu"
					/>
				</div>

				<!-- Desktop -->
				<div class="gt-xs row q-gutter-sm">
					<q-input
						v-model="filters.name"
						outlined
						label="Transaction name"
						clearable
						class="col-8"
					>
						<template #append>
							<q-icon name="search" />
						</template>
					</q-input>
					<q-select
						class="col"
						outlined
						v-model="filters.categories"
						:options="TRANSACTION_CATEGORIES_MAIN"
						use-chips
						multiple
						stack-label
						label="Categories"
					/>
				</div>
			</q-card-section>
		</q-card>
	</q-expansion-item>

	<q-separator spaced="1rem" />

	<div v-if="transactionsInStore.length > 0">
		<TransactionItem
			v-for="transaction in pagedTransactions"
			:key="transaction.id"
			:transaction="transaction"
			class="q-mb-sm"
		/>

		<div class="row justify-center q-my-md">
			<q-pagination
				v-model="currentPage"
				:max="totalPages"
				direction-links
				:max-pages="7"
				boundary-numbers
			/>
		</div>

		<div v-if="!allPagesLoaded" class="row justify-center">
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
import { computed, ref, reactive } from 'vue';
import { storeToRefs } from 'pinia';

import { storeTransactions } from 'src/stores/transactions';
import { TRANSACTION_CATEGORIES_MAIN } from 'src/types/constants';

import TransactionItem from './TransactionItem.vue';

const props = defineProps({
	accountId: {
		type: Number,
		required: true,
	},
});

const transactions = storeTransactions();
const { loadTransactions } = transactions;
const { transactions: transactionsInStore, allPagesLoaded } =
	storeToRefs(transactions);

await loadTransactions(props.accountId);

const filters: { name: string; categories: string[] } = reactive({
	name: '',
	categories: [],
});
const filteredTransactions = computed(() => {
	return transactionsInStore.value.filter((transaction) => {
		let nameMatch = true;
		let categoryMatch = true;

		if (filters.name) {
			const transactionNameLowercase = transaction.name.toLowerCase();
			nameMatch = transactionNameLowercase.includes(filters.name.toLowerCase());
		}

		if (filters.categories.length > 0) {
			categoryMatch = filters.categories.includes(transaction.category_main);
		}

		return nameMatch && categoryMatch;
	});
});

const pageSize = 6;
const currentPage = ref(1);
const totalPages = computed(() =>
	Math.ceil(filteredTransactions.value.length / pageSize)
);
const pagedTransactions = computed(() => {
	const startIndex = (currentPage.value - 1) * pageSize;
	const endIndex = currentPage.value * pageSize;

	return filteredTransactions.value.slice(startIndex, endIndex);
});
</script>

<style scoped></style>
