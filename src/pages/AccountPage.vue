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
					<div class="text-h6">Import or export transactions</div>
				</q-tab-panel>
			</q-tab-panels>
		</q-card>

		<!-- <AccountInfoCard :account-id="id" /> -->
	</q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { storeTransactions } from 'src/stores/transactions';

import AccountInfoCard from 'src/components/AccountInfoCard.vue';
import AccountTabTransactions from 'src/components/AccountTabTransactions.vue';

defineProps({
	id: {
		type: String,
		required: true,
	},
});

const transactions = storeTransactions();
const { resetTransactions } = transactions;

const tab = ref('transactions');

resetTransactions();
</script>

<style scoped></style>
