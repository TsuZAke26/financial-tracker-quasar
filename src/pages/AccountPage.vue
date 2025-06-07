<template>
	<q-page
		class="q-pa-lg"
		style="max-width: 1024px; width: 100%; margin: 0 auto"
	>
		<AccountInfoCard :account-id="id" />

		<div class="q-py-md" />

		<q-card bordered flat>
			<q-tabs
				v-model="tab"
				class="text-grey"
				active-color="primary"
				align="justify"
				indicator-color="primary"
				dense
				narrow-indicator
			>
				<q-tab label="Transactions" name="transactions" />
				<q-tab label="Import/Export" name="import-export" />
				<q-tab label="Budgets" name="budgets" />
				<q-tab label="Reports" name="reports" />
			</q-tabs>
			<q-tab-panels v-model="tab" animated>
				<q-tab-panel name="transactions">
					<Suspense>
						<AccountTabTransactions :account-id="Number.parseInt(id)" />
						<template #fallback>
							<div
								class="row justify-center items-center"
								style="height: 300px"
							>
								<q-spinner size="3rem" />
							</div>
						</template>
					</Suspense>
				</q-tab-panel>

				<q-tab-panel name="import-export">
					<AccountTabImportExport :account-id="Number.parseInt(id)" />
				</q-tab-panel>

				<q-tab-panel name="budgets">
					<Suspense>
						<AccountTabBudgets :account-id="Number.parseInt(id)" />
						<template #fallback>
							<div
								class="row justify-center items-center"
								style="height: 300px"
							>
								<q-spinner size="3rem" />
							</div>
						</template>
					</Suspense>
				</q-tab-panel>

				<q-tab-panel name="reports">
					<AccountTabReports :account-id="Number.parseInt(id)" />
				</q-tab-panel>
			</q-tab-panels>
		</q-card>

		<!-- <AccountInfoCard :account-id="id" /> -->
		<q-page-sticky
			v-if="tab === 'transactions'"
			:offset="[24, 24]"
			position="bottom-right"
		>
			<q-btn
				@click="showAddTransactionDialog"
				color="secondary"
				icon="add"
				label="Transaction"
				fab
			/>
		</q-page-sticky>
	</q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Dialog } from 'quasar';

import { storeTransactions } from 'src/stores/transactions';

import AccountInfoCard from 'src/components/AccountInfoCard.vue';
import AccountTabTransactions from 'src/components/AccountTabTransactions.vue';
import AccountTabImportExport from 'src/components/AccountTabImportExport.vue';
import AccountTabBudgets from 'src/components/AccountTabBudgets.vue';
import AccountTabReports from 'src/components/AccountTabReports.vue';
import AddTransaction from 'src/components/AddTransaction.vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const transactions = storeTransactions();
const { resetTransactions } = transactions;

const tab = ref('transactions');

resetTransactions();

const showAddTransactionDialog = () => {
	Dialog.create({
		component: AddTransaction,
		componentProps: {
			accountId: Number.parseInt(props.id),
		},
	});
};
</script>

<style scoped></style>
