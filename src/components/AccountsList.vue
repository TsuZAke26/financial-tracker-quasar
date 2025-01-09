<template>
	<div>
		<q-card flat bordered class="accounts-list-card">
			<q-card-section>
				<div class="text-h6">Checking</div>
				<q-list>
					<q-item
						v-for="account in accountsByType('Checking')"
						:key="account.id"
						clickable
					>
						<q-item-section>{{ account.name }}</q-item-section>
						<q-item-section side>
							{{
								formatAmount(settings.financial.currencySymbol, account.balance)
							}}
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>
			<q-card-section>
				<div class="text-h6">Savings</div>
				<q-list>
					<q-item
						v-for="account in accountsByType('Savings')"
						:key="account.id"
						clickable
					>
						<q-item-section>{{ account.name }}</q-item-section>
						<q-item-section side>
							{{
								formatAmount(settings.financial.currencySymbol, account.balance)
							}}
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>
			<q-card-section>
				<div class="text-h6">Credit Lines</div>
				<q-list>
					<q-item
						v-for="account in accountsByType('Credit Line')"
						:key="account.id"
						clickable
					>
						<q-item-section>{{ account.name }}</q-item-section>
						<q-item-section side>
							{{
								formatAmount(settings.financial.currencySymbol, account.balance)
							}}
						</q-item-section>
					</q-item>
				</q-list>
			</q-card-section>
		</q-card>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { storeUser } from 'src/stores/user';
import { storeAccounts } from 'src/stores/accounts';

import { formatAmount } from 'src/util/currency-utils';

const user = storeUser();
const { settings } = storeToRefs(user);

const accounts = storeAccounts();
const { accounts: accountsInStore } = storeToRefs(accounts);
const { loadAccounts } = accounts;

const accountsByType = computed(() => {
	return (type: 'Checking' | 'Savings' | 'Credit Line') => {
		return accountsInStore.value.filter(
			(account) => account.account_type === type
		);
	};
});

await loadAccounts();
</script>

<style scoped>
.accounts-list-card {
	width: 100%;
	min-width: 400px;
}
</style>
