<template>
	<div>
		<div v-if="loading">
			<q-spinner size="3em" />
		</div>
		<div v-else>
			<q-card flat bordered class="accounts-list-card">
				<q-card-section>
					<div class="text-h6">Checking</div>
					<q-list>
						<q-item
							v-for="account in accountsByType('Checking')"
							:key="account.id"
							clickable
							@click="handleAccountClick(account.id)"
						>
							<q-item-section>{{ account.name }}</q-item-section>
							<q-item-section side>
								{{
									formatAmount(
										settings.financial.currencySymbol,
										account.balance
									)
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
							@click="handleAccountClick(account.id)"
						>
							<q-item-section>{{ account.name }}</q-item-section>
							<q-item-section side>
								{{
									formatAmount(
										settings.financial.currencySymbol,
										account.balance
									)
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
							@click="handleAccountClick(account.id)"
						>
							<q-item-section>{{ account.name }}</q-item-section>
							<q-item-section side>
								{{
									formatAmount(
										settings.financial.currencySymbol,
										account.balance
									)
								}}
							</q-item-section>
						</q-item>
					</q-list>
				</q-card-section>
			</q-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { storeUser } from 'src/stores/user';
import { storeAccounts } from 'src/stores/accounts';

import { formatAmount } from 'src/composables/useCurrency';

const user = storeUser();
const { settings } = storeToRefs(user);

const accounts = storeAccounts();
const { accounts: accountsInStore, loading } = storeToRefs(accounts);
// const { loadAccounts } = accounts;

const accountsByType = computed(() => {
	return (type: 'Checking' | 'Savings' | 'Credit Line') => {
		return accountsInStore.value.filter(
			(account) => account.account_type === type
		);
	};
});

const router = useRouter();
const handleAccountClick = (id: number) => {
	router.push({
		name: 'account',
		params: {
			id,
		},
	});
};

// await loadAccounts();
</script>

<style scoped>
.accounts-list-card {
	width: 100%;
	min-width: 360px;
}
</style>
