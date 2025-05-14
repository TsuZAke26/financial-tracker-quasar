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
						title="Checking"
						:accounts="accountsByType('Checking')"
					/>
				</div>

				<div>
					<AccountsListCard
						title="Savings"
						:accounts="accountsByType('Savings')"
					/>
				</div>

				<div>
					<AccountsListCard
						title="Credit Lines"
						:accounts="accountsByType('Credit Line')"
					/>
				</div>
			</div>

			<!-- Desktop -->
			<div class="gt-sm row items-start q-gutter-md">
				<AccountsListCard
					title="Checking"
					:accounts="accountsByType('Checking')"
					class="col"
				/>

				<AccountsListCard
					title="Savings"
					:accounts="accountsByType('Savings')"
					class="col"
				/>
				<AccountsListCard
					title="Credit Lines"
					:accounts="accountsByType('Credit Line')"
					class="col"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
// import { useRouter } from 'vue-router';

// import { storeUser } from 'src/stores/user';
import { storeAccounts } from 'src/stores/accounts';

// import { formatAmount } from 'src/composables/useCurrency';
import { sortByName } from 'src/util/account-utils';

import AccountsListCard from './AccountsListCard.vue';

// const user = storeUser();
// const { settings } = storeToRefs(user);

const accounts = storeAccounts();
const { accounts: accountsInStore, loading } = storeToRefs(accounts);
// const { loadAccounts } = accounts;

const accountsByType = computed(() => {
	return (type: 'Checking' | 'Savings' | 'Credit Line') => {
		return accountsInStore.value
			.filter((account) => account.account_type === type)
			.sort(sortByName);
	};
});

// const router = useRouter();
// const handleAccountClick = (id: number) => {
// 	router.push({
// 		name: 'account',
// 		params: {
// 			id,
// 		},
// 	});
// };

// await loadAccounts();
</script>

<style scoped></style>
