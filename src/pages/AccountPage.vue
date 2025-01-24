<template>
	<q-page class="q-pa-lg">
		<AccountInfoCard :account-id="id" />

		<div class="q-py-md" />
		<!-- <div style="height: 4rem" /> -->

		<q-card flat bordered>
			<q-tabs
				v-model="tab"
				dense
				class="text-grey"
				active-color="primary"
				indicator-color="primary"
				align="justify"
				narrow-indicator
			>
				<q-tab name="transactions" label="Transactions" />
				<q-tab name="import-export" label="Import/Export" />
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
			</q-tab-panels>
		</q-card>

		<!-- <AccountInfoCard :account-id="id" /> -->
		<q-page-sticky position="bottom-right" :offset="[24, 24]">
			<q-btn
				fab
				icon="add"
				color="secondary"
				label="Transaction"
				@click="showAddTransactionDialog"
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
	}).onOk(() => console.log('add transaction form: ok'));
};
</script>

<style scoped></style>
