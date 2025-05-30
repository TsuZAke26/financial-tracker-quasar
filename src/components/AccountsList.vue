<template>
	<div>
		<div v-if="loading">
			<q-spinner size="3em" />
		</div>
		<div v-else>
			<!-- Mobile -->
			<div class="lt-md column q-col-gutter-md">
				<div>
					<AccountsListCard
						:accounts="accountsByType('Checking')"
						title="Checking"
					/>
				</div>

				<div>
					<AccountsListCard
						:accounts="accountsByType('Savings')"
						title="Savings"
					/>
				</div>

				<div>
					<AccountsListCard
						:accounts="accountsByType('Credit Line')"
						title="Credit Lines"
					/>
				</div>
			</div>

			<!-- Desktop -->
			<div class="gt-sm row items-start q-gutter-md">
				<AccountsListCard
					:accounts="accountsByType('Checking')"
					class="col"
					title="Checking"
				/>

				<AccountsListCard
					:accounts="accountsByType('Savings')"
					class="col"
					title="Savings"
				/>

				<AccountsListCard
					:accounts="accountsByType('Credit Line')"
					class="col"
					title="Credit Lines"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { storeAccounts } from 'src/stores/accounts';
import { sortByName } from 'src/util/account-utils';

import AccountsListCard from './AccountsListCard.vue';

const accounts = storeAccounts();
const { accounts: accountsInStore, loading } = storeToRefs(accounts);

const accountsByType = computed(() => {
	return (type: 'Checking' | 'Savings' | 'Credit Line') => {
		return accountsInStore.value
			.filter((account) => account.account_type === type)
			.sort(sortByName);
	};
});
</script>

<style scoped></style>
